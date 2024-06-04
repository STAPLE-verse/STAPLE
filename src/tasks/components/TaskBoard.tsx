// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// see here https://github.com/microsoft/TypeScript/issues/49613

//packages
import { useState } from "react"
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { HTMLAttributes, ClassAttributes } from "react"
import { useMutation } from "@blitzjs/rpc"
import updateTaskOrder from "../mutations/updateTaskOrder"
import updateColumnOrder from "../mutations/updateColumnOrder"

// get specific components for this board
import TaskContainer from "src/tasks/components/TaskContainer"
import TaskItems from "src/tasks/components/TaskItems"
import AddContainer from "./AddContainer"
import useTaskBoardData from "../hooks/useTaskBoardData"

//interface
interface TaskBoardProps extends HTMLAttributes<HTMLElement>, ClassAttributes<HTMLElement> {
  projectId: number
}

const TaskBoard = ({ projectId }: TaskBoardProps) => {
  const [updateTaskOrderMutation] = useMutation(updateTaskOrder)
  const [updateColumnOrderMutation] = useMutation(updateColumnOrder)

  const { containers, refetch, updateContainers } = useTaskBoardData(projectId)

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [currentContainerId, setCurrentContainerId] = useState<UniqueIdentifier>()

  // Find the value of the items
  function findValueOfItems(id: UniqueIdentifier | undefined, type: string) {
    if (type === "container") {
      return containers.find((item) => item.id === id)
    }
    if (type === "item") {
      return containers.find((container) => container.items.find((item) => item.id === id))
    }
  }

  const findItemTitle = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "item")
    if (!container) return ""
    const item = container.items.find((item) => item.id === id)
    if (!item) return ""
    return item.title
  }

  const findContainerTitle = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "container")
    if (!container) return ""
    return container.title
  }

  const findContainerItems = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, "container")
    if (!container) return []
    return container.items
  }

  // DND Handlers
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const { id } = active
    setActiveId(id)
  }

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event

    // Handle Items Sorting
    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("item") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active container and over container
      const activeContainer = findValueOfItems(active.id, "item")
      const overContainer = findValueOfItems(over.id, "item")

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return

      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id
      )
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id
      )

      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex((item) => item.id === active.id)
      const overitemIndex = overContainer.items.findIndex((item) => item.id === over.id)
      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        let newItems = [...containers]
        newItems[activeContainerIndex].items = arrayMove(
          newItems[activeContainerIndex].items,
          activeitemIndex,
          overitemIndex
        )

        updateContainers(newItems)
      } else {
        // In different containers
        let newItems = [...containers]
        const [removeditem] = newItems[activeContainerIndex].items.splice(activeitemIndex, 1)
        newItems[overContainerIndex].items.splice(overitemIndex, 0, removeditem)
        updateContainers(newItems)
      }
    }

    // Handling Item Drop Into a Container
    if (
      active.id.toString().includes("item") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, "item")
      const overContainer = findValueOfItems(over.id, "container")

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return

      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id
      )
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id
      )

      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex((item) => item.id === active.id)

      // Remove the active item from the active container and add it to the over container
      let newItems = [...containers]
      const [removeditem] = newItems[activeContainerIndex].items.splice(activeitemIndex, 1)
      newItems[overContainerIndex].items.push(removeditem)

      updateContainers(newItems)
    }
  }

  // This is the function that handles the sorting of the containers and items when the user is done dragging.
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    let newContainers = [...containers]

    // Handling Container Sorting
    if (
      active.id.toString().includes("container") &&
      over?.id.toString().includes("container") &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex((container) => container.id === active.id)
      const overContainerIndex = containers.findIndex((container) => container.id === over.id)
      // Swap the active and over container
      newContainers = arrayMove(newContainers, activeContainerIndex, overContainerIndex)
      updateContainers(newContainers)
      const newColumnOrder = newContainers.map((container) =>
        parseInt(container.id.replace("container-", ""))
      )
      updateColumnOrderMutation({ columnIds: newColumnOrder })
        .then(() => console.log("Column order updated successfully!"))
        .catch((error) => console.error("Failed to update column order", error))
    } else {
      // Handling item Sorting
      if (
        active.id.toString().includes("item") &&
        over?.id.toString().includes("item") &&
        active &&
        over &&
        active.id !== over.id
      ) {
        // Find the active and over container
        const activeContainer = findValueOfItems(active.id, "item")
        const overContainer = findValueOfItems(over.id, "item")

        // If the active or over container is not found, return
        if (!activeContainer || !overContainer) return
        // Find the index of the active and over container
        const activeContainerIndex = containers.findIndex(
          (container) => container.id === activeContainer.id
        )
        const overContainerIndex = containers.findIndex(
          (container) => container.id === overContainer.id
        )
        // Find the index of the active and over item
        const activeitemIndex = activeContainer.items.findIndex((item) => item.id === active.id)
        const overitemIndex = overContainer.items.findIndex((item) => item.id === over.id)

        // In the same container
        if (activeContainerIndex === overContainerIndex) {
          newContainers[activeContainerIndex].items = arrayMove(
            newContainers[activeContainerIndex].items,
            activeitemIndex,
            overitemIndex
          )
          updateContainers(newContainers)
        } else {
          // In different containers
          const [removeditem] = newContainers[activeContainerIndex].items.splice(activeitemIndex, 1)
          newContainers[overContainerIndex].items.splice(overitemIndex, 0, removeditem)
          updateContainers(newContainers)
        }
      }

      // Handling item dropping into Container
      if (
        active.id.toString().includes("item") &&
        over?.id.toString().includes("container") &&
        active &&
        over &&
        active.id !== over.id
      ) {
        // Find the active and over container
        const activeContainer = findValueOfItems(active.id, "item")
        const overContainer = findValueOfItems(over.id, "container")

        // If the active or over container is not found, return
        if (!activeContainer || !overContainer) return
        // Find the index of the active and over container
        const activeContainerIndex = containers.findIndex(
          (container) => container.id === activeContainer.id
        )
        const overContainerIndex = containers.findIndex(
          (container) => container.id === overContainer.id
        )
        // Find the index of the active and over item
        const activeitemIndex = activeContainer.items.findIndex((item) => item.id === active.id)

        const [removeditem] = newContainers[activeContainerIndex].items.splice(activeitemIndex, 1)
        newContainers[overContainerIndex].items.push(removeditem)
        updateContainers(newContainers)
      }

      const updateTasksList = newContainers.flatMap((container) =>
        container.items.map((item, itemIdx) => ({
          taskId: parseInt(item.id.replace("item-", "")),
          columnId: parseInt(container.id.replace("container-", "")),
          columnTaskIndex: itemIdx,
        }))
      )

      updateTaskOrderMutation({ tasks: updateTasksList })
        .then(() => console.log("Tasks updated successfully!"))
        .catch((error) => console.error("Failed to update tasks", error))
    }

    setActiveId(null)
  }

  return (
    <div className="mx-auto max-w-7xl py-10">
      <AddContainer projectId={projectId} refetch={refetch}></AddContainer>
      <div className="mt-10">
        <div className="grid grid-cols-3 gap-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={containers.map((i) => i.id)}>
              {containers.map((container) => (
                <TaskContainer
                  id={container.id}
                  title={container.title}
                  key={container.id}
                  onAddItem={() => {
                    setShowAddItemModal(true)
                    setCurrentContainerId(container.id)
                  }}
                >
                  <SortableContext items={container.items.map((i) => i.id)}>
                    <div className="flex items-start flex-col gap-y-4">
                      {container.items.map((i) => (
                        <TaskItems title={i.title} id={i.id} key={i.id} projectId={projectId} />
                      ))}
                    </div>
                  </SortableContext>
                </TaskContainer>
              ))}
            </SortableContext>

            <DragOverlay adjustScale={false}>
              {/* Drag Overlay For item Item */}
              {activeId && activeId.toString().includes("item") && (
                <TaskItems id={activeId} title={findItemTitle(activeId)} />
              )}
              {/* Drag Overlay For Container */}
              {activeId && activeId.toString().includes("container") && (
                <TaskContainer id={activeId} title={findContainerTitle(activeId)}>
                  {findContainerItems(activeId).map((i) => (
                    <TaskItems key={i.id} title={i.title} id={i.id} />
                  ))}
                </TaskContainer>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  )
}

export default TaskBoard
