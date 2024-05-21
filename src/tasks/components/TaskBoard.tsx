// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// see here https://github.com/microsoft/TypeScript/issues/49613

//packages
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
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
import { useQuery, useMutation } from "@blitzjs/rpc"
import getColumns from "../queries/getColumns"
import createColumn from "src/tasks/mutations/createColumn"
import updateTaskOrder from "../mutations/updateTaskOrder"
import updateColumnOrder from "../mutations/updateColumnOrder"

// get specific components for this board
import TaskContainer from "src/tasks/components/TaskContainer"
import TaskItems from "src/tasks/components/TaskItems"
import TaskModal from "src/tasks/components/TaskModal"
import TaskInput from "src/tasks/components/TaskInput"

//interface
interface TaskBoardProps extends HTMLAttributes<HTMLElement>, ClassAttributes<HTMLElement> {
  projectId: number
}

// interface ColumnWithTasks extends Column {
//   tasks: Task[] // Assuming "Task" is the type for tasks
// }

const TaskBoard = ({ projectId }: TaskBoardProps) => {
  const [createColumnMutation] = useMutation(createColumn)
  const [updateTaskOderMutation] = useMutation(updateTaskOrder)
  const [updateColumnOderMutation] = useMutation(updateColumnOrder)

  type DNDType = {
    id: UniqueIdentifier
    title: string
    items: {
      id: UniqueIdentifier
      title: string
    }[]
  }

  // here we need to loop through their tasks and
  // put them where they were but need to integrate
  // with saving as well
  const [containers, setContainers] = useState<DNDType[]>([])
  const [columns, { refetch }]: [ColumnWithTasks[], any] = useQuery(getColumns, {
    orderBy: { columnIndex: "asc" },
    where: { project: { id: projectId! } },
    include: {
      tasks: {
        orderBy: {
          columnTaskIndex: "asc",
        },
      },
    },
  })

  useEffect(() => {
    // Transform query data to the desired structure
    const transformedData = columns.map((container) => ({
      id: `container-${container.id}`,
      title: container.name,
      items: container.tasks.map((task) => ({
        id: `item-${task.id}`,
        title: task.name,
      })),
    }))

    // Update state with the transformed data
    setContainers(transformedData)
  }, [columns])

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [currentContainerId, setCurrentContainerId] = useState<UniqueIdentifier>()
  const [containerName, setContainerName] = useState("")
  const [showAddContainerModal, setShowAddContainerModal] = useState(false)

  const onAddContainer = async () => {
    if (!containerName) return
    await createColumnMutation({ projectId: projectId, name: containerName })
    setContainerName("")
    setShowAddContainerModal(false)
    refetch()
  }

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

        setContainers(newItems)
      } else {
        // In different containers
        let newItems = [...containers]
        const [removeditem] = newItems[activeContainerIndex].items.splice(activeitemIndex, 1)
        newItems[overContainerIndex].items.splice(overitemIndex, 0, removeditem)
        setContainers(newItems)
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
      // console.log(newItems)
      setContainers(newItems)
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
      setContainers(newContainers)
      const newColumnOrder = newContainers.map((container) =>
        parseInt(container.id.replace("container-", ""))
      )
      updateColumnOderMutation({ columnIds: newColumnOrder })
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
          setContainers(newContainers)
        } else {
          // In different containers
          const [removeditem] = newContainers[activeContainerIndex].items.splice(activeitemIndex, 1)
          newContainers[overContainerIndex].items.splice(overitemIndex, 0, removeditem)
          setContainers(newContainers)
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
        setContainers(newContainers)
      }

      const updateTasksList = newContainers.flatMap((container) =>
        container.items.map((item, itemIdx) => ({
          taskId: parseInt(item.id.replace("item-", "")),
          columnId: parseInt(container.id.replace("container-", "")),
          columnTaskIndex: itemIdx,
        }))
      )

      updateTaskOderMutation({ tasks: updateTasksList })
        .then(() => console.log("Tasks updated successfully!"))
        .catch((error) => console.error("Failed to update tasks", error))
    }

    setActiveId(null)
  }

  return (
    <div className="mx-auto max-w-7xl py-10">
      {/* Add Container Modal */}
      <TaskModal showModal={showAddContainerModal} setShowModal={setShowAddContainerModal}>
        <div className="flex flex-col w-full items-start gap-y-4">
          <h1 className="text-3xl font-bold">Add Container</h1>
          <TaskInput
            type="text"
            placeholder="Container Title"
            name="containername"
            value={containerName}
            onChange={(e) => setContainerName(e.target.value)}
          />
          <button type="button" className="btn btn-primary" onClick={onAddContainer}>
            Add container
          </button>
        </div>
      </TaskModal>

      <div className="flex items-center justify-between gap-y-2">
        <h1 className="text-3xl font-bold">Project Tasks</h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowAddContainerModal(true)}
        >
          Add Container
        </button>
      </div>

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
