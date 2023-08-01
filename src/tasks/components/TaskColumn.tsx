import React from "react"
import { HTMLAttributes, ClassAttributes } from "react"
import { Column } from "@prisma/client"
import TaskCard from "./TaskCard"
import { usePaginatedQuery } from "@blitzjs/rpc"
import getTasks from "src/tasks/queries/getTasks"
import { useRouter } from "next/router"

interface TaskColumnProps extends HTMLAttributes<HTMLElement>, ClassAttributes<HTMLElement> {
  column: Column
}

// Set the maximum number of tasks to return for the column
// TODO: Extend logic should be added or pagination to the UI
const ITEMS_PER_PAGE = 10

const TaskColumn = ({ column }: TaskColumnProps) => {
  // Get tasks for the column
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ tasks, hasMore }] = usePaginatedQuery(getTasks, {
    where: { column: { id: column.id } },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  // Render each task of the column
  const columnTasks = tasks.map((task) => <TaskCard task={task} key={task.name} />)

  // Return individual task cards for the column
  return (
    <div className="flex flex-col flex-1 bg-gray-300 p-4 rounded-lg shadow-md">
      <h1 className="pb-2">{column.name}</h1>
      <div className="flex-col space-y-6">{columnTasks}</div>
    </div>
  )
}

export default TaskColumn
