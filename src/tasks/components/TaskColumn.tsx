import React from "react"
import { HTMLAttributes, ClassAttributes } from "react"
import { Column } from "db"

import { usePaginatedQuery } from "@blitzjs/rpc"
import getTasks from "src/tasks/queries/getTasks"
import { useRouter } from "next/router"
import SortableTaskCard from "./SortableTaskCard"

import { useDroppable } from "@dnd-kit/core"

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"

interface TaskColumnProps extends HTMLAttributes<HTMLElement>, ClassAttributes<HTMLElement> {
  column: Column
  columnId: number
}

// Set the maximum number of tasks to return for the column
// TODO: Extend logic should be added or pagination to the UI
const ITEMS_PER_PAGE = 10

const TaskColumn = ({ column, columnId }: TaskColumnProps) => {
  // Setup
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const { setNodeRef } = useDroppable({
    id: columnId,
  })

  // Get all the tasks for the column with pagination
  const [{ tasks: tasks, hasMore }] = usePaginatedQuery(getTasks, {
    where: { column: { id: column.id } },
    orderBy: { columnTaskIndex: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  // Render each task of the column
  const items = tasks.map((task) => task.id)

  // Return individual task cards for the column
  return (
    <div className="flex flex-col flex-1 bg-gray-300 p-4 rounded-lg shadow-md">
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <h1 className="pb-2">{column.name}</h1>
        <div ref={setNodeRef} className="flex flex-col space-y-6">
          {items.map((id) => (
            <SortableTaskCard taskId={id} key={id} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

export default TaskColumn
