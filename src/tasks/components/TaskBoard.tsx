// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// see here https://github.com/microsoft/TypeScript/issues/49613

//packages
import { useState } from "react"
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
import { Column, Task } from "db"

// get specific components for this board
import TaskContainer from "src/tasks/components/TaskContainer"
import TaskItems from "src/tasks/components/TaskItems"
import TaskModal from "src/tasks/components/TaskModal"
import TaskInput from "src/tasks/components/TaskInput"

//interface
interface TaskBoardProps extends HTMLAttributes<HTMLElement>, ClassAttributes<HTMLElement> {
  projectId: number
}

interface ColumnWithTasks extends Column {
  tasks: Task[] // Assuming "Task" is the type for tasks
}

const TaskBoard = ({ projectId }: TaskBoardProps) => {
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
  const [containers, setContainers] = useState<DNDType[]>([
    {
      id: `container-${uuidv4()}`,
      title: "To Do",
      items: [
        {
          id: `item-${uuidv4()}`,
          title: "Item 1",
        },
      ],
    },
    {
      id: `container-${uuidv4()}`,
      title: "Done",
      items: [
        {
          id: `item-${uuidv4()}`,
          title: "Item 2",
        },
      ],
    },
  ])

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [currentContainerId, setCurrentContainerId] = useState<UniqueIdentifier>()
  const [containerName, setContainerName] = useState("")
  const [itemName, setItemName] = useState("")
  const [showAddContainerModal, setShowAddContainerModal] = useState(false)
  const [showAddItemModal, setShowAddItemModal] = useState(false)

  const onAddContainer = () => {
    if (!containerName) return
    const id = `container-${uuidv4()}`
    setContainers([
      ...containers,
      {
        id,
        title: containerName,
        items: [],
      },
    ])
    setContainerName("")
    setShowAddContainerModal(false)
  }

  const onAddItem = () => {
    if (!itemName) return
    const id = `item-${uuidv4()}`
    const container = containers.find((item) => item.id === currentContainerId)
    if (!container) return
    container.items.push({
      id,
      title: itemName,
    })
    setContainers([...containers])
    setItemName("")
    setShowAddItemModal(false)
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
      setContainers(newItems)
    }
  }

  // This is the function that handles the sorting of the containers and items when the user is done dragging.
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

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
      let newItems = [...containers]
      newItems = arrayMove(newItems, activeContainerIndex, overContainerIndex)
      setContainers(newItems)
    }

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

      let newItems = [...containers]
      const [removeditem] = newItems[activeContainerIndex].items.splice(activeitemIndex, 1)
      newItems[overContainerIndex].items.push(removeditem)
      setContainers(newItems)
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

      {/* Add Item Modal */}
      <TaskModal showModal={showAddItemModal} setShowModal={setShowAddItemModal}>
        <div className="flex flex-col w-full items-start gap-y-4">
          <h1 className="text-3xl font-bold">Add Item</h1>
          <TaskInput
            type="text"
            placeholder="Item Title"
            name="itemname"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <button type="button" className="btn btn-primary" onClick={onAddItem}>
            Add Item
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
                        <TaskItems title={i.title} id={i.id} key={i.id} />
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
