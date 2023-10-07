import React from "react"
import { HTMLAttributes, ClassAttributes } from "react"
import { Column } from "db"

import { usePaginatedQuery } from "@blitzjs/rpc"
import getTasks from "src/tasks/queries/getTasks"
import { useRouter } from "next/router"
import SortableTaskCard from "./SortableTaskCard"
import TaskCard from "./TaskCard"
import { useDroppable, DragOverlay, useDndMonitor } from "@dnd-kit/core"

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"

interface TaskColumnProps extends HTMLAttributes<HTMLElement>, ClassAttributes<HTMLElement> {
  column: Column
}

// Set the maximum number of tasks to return for the column
// TODO: Extend logic should be added or pagination to the UI
const ITEMS_PER_PAGE = 10

const TaskColumn = ({ column }: TaskColumnProps) => {
  // Setup
  const router = useRouter()
  const page = Number(router.query.page) || 0

  const { isOver, setNodeRef } = useDroppable({
    id: `column-${column.id}`,
  })

  const style = {
    color: isOver ? "green" : undefined,
  }

  // Get all the tasks for the column with pagination
  const [{ tasks: tasks, hasMore }] = usePaginatedQuery(getTasks, {
    where: { column: { id: column.id } },
    orderBy: { columnTaskIndex: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  // Render each task of the column
  // const items = tasks.map((task) => task.id)

  // Return individual task cards for the column
  return (
    <div className="flex flex-col flex-1 bg-gray-300 p-4 rounded-lg shadow-md">
      <h1>{column.name}</h1>
      <div
        ref={setNodeRef}
        style={style}
        className="flex flex-col flex-grow h-full space-y-6 p-3 bg-red-600"
      >
        {tasks.map((task) => (
          <TaskCard taskId={task.id} key={task.id} name={task.name} projectId={task.projectId} />
        ))}
      </div>
    </div>
  )
}

export default TaskColumn
