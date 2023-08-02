import React from "react"
import { HTMLAttributes, ClassAttributes } from "react"
import { Task } from "@prisma/client"
import { Routes } from "@blitzjs/next"
import Link from "next/link"

interface TaskCardProps extends HTMLAttributes<HTMLElement>, ClassAttributes<HTMLElement> {
  task: Task
}

const TaskCard = ({ task }: TaskCardProps) => {
  return (
    <Link href={Routes.ShowTaskPage({ projectId: task.projectId!, taskId: task.id })}>
      <div className="rounded bg-base-200 p-4">
        <h2>{task.name}</h2>
        <p>{task.description}</p>
      </div>
    </Link>
  )
}

export default TaskCard
