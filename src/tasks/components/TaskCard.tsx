import React, { forwardRef } from "react"
import { HTMLAttributes, ClassAttributes } from "react"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"

interface TaskCardProps extends HTMLAttributes<HTMLElement>, ClassAttributes<HTMLElement> {
  name: string
  taskId: number
  projectId: number
}

const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(({ name, projectId, taskId }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `task-${taskId}`,
    // disabled: true,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    // TODO: Find a good solution to open task when clicked that works with dnd Link not working
    <div
      className="rounded bg-base-200 p-4"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <h2>{name}</h2>
      {/* <p>{task.description}</p> */}
      <div className="flex justify-end">
        <Link
          href={Routes.ShowTaskPage({ projectId: projectId, taskId: taskId })}
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
