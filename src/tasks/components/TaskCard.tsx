import React from "react"
import { HTMLAttributes, ClassAttributes } from "react"
import { Task } from "@prisma/client"

interface TaskCardProps extends HTMLAttributes<HTMLElement>, ClassAttributes<HTMLElement> {
  task: Task
}

const TaskCard = ({ task }: TaskCardProps) => {
  return (
    <div className="rounded bg-base-200 p-4">
      <h2>{task.name}</h2>
      <p>{task.description}</p>
    </div>
  )
}

export default TaskCard
