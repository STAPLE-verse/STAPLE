import React, { useState } from "react"
import { HTMLAttributes, ClassAttributes } from "react"
import { Column } from "@prisma/client"
import TaskCard from "./TaskCard"
import { usePaginatedQuery, useMutation } from "@blitzjs/rpc"
import getTasks from "src/tasks/queries/getTasks"
import { useRouter } from "next/router"
import updateTaskOrder from "../mutations/updateTaskOrder"
import SortableTaskCard from "./SortableTaskCard"

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

interface TaskColumnProps extends HTMLAttributes<HTMLElement>, ClassAttributes<HTMLElement> {
  column: Column
}

// Set the maximum number of tasks to return for the column
// TODO: Extend logic should be added or pagination to the UI
const ITEMS_PER_PAGE = 10

const TaskColumn = ({ column }: TaskColumnProps) => {
  // Handle drag and drop
  const [updateTaskOrderMutation] = useMutation(updateTaskOrder)

  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Get tasks for the column
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ tasks, hasMore }] = usePaginatedQuery(getTasks, {
    where: { column: { id: column.id } },
    orderBy: { columnTaskIndex: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  // Render each task of the column
  const items = tasks.map((task) => task.id)

  // Return individual task cards for the column
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col flex-1 bg-gray-300 p-4 rounded-lg shadow-md">
          <h1 className="pb-2">{column.name}</h1>
          <div className="flex flex-col space-y-6">
            {items.map((id) => (
              <SortableTaskCard taskId={id} key={id} />
            ))}
          </div>
        </div>
      </SortableContext>
      <DragOverlay>{activeId ? <TaskCard taskId={activeId} /> : null}</DragOverlay>
    </DndContext>
  )

  function handleDragStart(event) {
    const { active } = event

    setActiveId(active.id)
  }

  async function handleDragEnd(event) {
    const { active, over } = event

    if (active.id !== over.id) {
      try {
        // Call the updateTaskOrder mutation to reorder the tasks
        await updateTaskOrderMutation({
          activeIndex: items.indexOf(active.id),
          overIndex: items.indexOf(over.id),
          activeId: active.id,
          overId: over.id,
        })
        console.log({
          activeIndex: items.indexOf(active.id),
          overIndex: items.indexOf(over.id),
          activeId: active.id,
          overId: over.id,
        })
      } catch (error) {
        // Handle any error that might occur during the mutation
        console.error("Error updating task order:", error)
      }
    }
    setActiveId(null)
  }
}

export default TaskColumn
