import React, { forwardRef } from "react"
import { HTMLAttributes, ClassAttributes } from "react"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Bars3Icon } from "@heroicons/react/24/outline"

interface TaskCardProps extends HTMLAttributes<HTMLElement>, ClassAttributes<HTMLElement> {
  name: string
  taskId: number
  projectId: number
  disable?: boolean
}

const TaskCard: React.FC<TaskCardProps> = ({ name, projectId, taskId, disable }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `task-${taskId}`,
    // disable should be true when user interacts with Open button
    disabled: disable,
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
      // {...listeners}
      {...attributes}
    >
      <div className="flex flex-row">
        {/* Drag handle added to the icon */}
        {/* TODO: Might not be the best icon for the job */}
        <Bars3Icon className="h-6 w-6 mr-2" {...listeners} />
        <h3>{name}</h3>
      </div>
      {/* <p>{task.description}</p> */}
      <div className="flex justify-end">
        <Link
          href={Routes.ShowTaskPage({ projectId: projectId, taskId: taskId })}
          className="btn mt-2 text-sm"
          // data-dnd-drag-handle="true"
        >
          Open
        </Link>
      </div>
    </div>
  )
}

export default TaskCard
