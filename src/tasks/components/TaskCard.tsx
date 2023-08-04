import React, { forwardRef } from "react"
import { HTMLAttributes, ClassAttributes } from "react"
import { Task } from "@prisma/client"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useQuery } from "@blitzjs/rpc"
import getTask from "src/tasks/queries/getTask"

interface TaskCardProps extends HTMLAttributes<HTMLElement>, ClassAttributes<HTMLElement> {
  taskId?: number
}

const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(({ taskId }, ref) => {
  const [task] = useQuery(getTask, { id: taskId })

  return (
    // TODO: Find a good solution to open task when clicked that works with dnd Link not working
    <div className="rounded bg-base-200 p-4" ref={ref}>
      <h2>{task.name}</h2>
      <p>{task.description}</p>
      <div className="flex justify-end">
        <Link
          href={Routes.ShowTaskPage({ projectId: task.projectId, taskId: task.id })}
          className="btn mt-2 text-sm"
          data-no-dnd="true"
        >
          Open
        </Link>
      </div>
    </div>
  )
})

export default TaskCard
