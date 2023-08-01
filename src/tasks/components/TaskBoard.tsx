import React from "react"
import { HTMLAttributes, ClassAttributes } from "react"
import TaskColumn from "./TaskColumn"
import { useQuery } from "@blitzjs/rpc"
import getColumns from "../queries/getColumns"

interface TaskBoardProps extends HTMLAttributes<HTMLElement>, ClassAttributes<HTMLElement> {
  projectId: number
}

const TaskBoard = ({ projectId }: TaskBoardProps) => {
  // Get all the columns for the project
  // TODO: question, do we want pagination for columns? how would that look like?
  const [columns, extras] = useQuery(getColumns, {
    orderBy: { id: "asc" },
    where: { project: { id: projectId! } },
  })

  // Return each column iteratively
  return (
    <div className="flex flex-row justify-center space-x-10">
      {columns.map((column) => (
        <TaskColumn column={column} key={column.id} />
      ))}
    </div>
  )
}

export default TaskBoard
