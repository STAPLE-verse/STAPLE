import React, { forwardRef } from "react"
import { HTMLAttributes, ClassAttributes } from "react"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useDraggable } from "@dnd-kit/core"
import { Bars3Icon } from "@heroicons/react/24/outline"

interface TaskCardProps extends HTMLAttributes<HTMLElement>, ClassAttributes<HTMLElement> {
  name: string
  taskId: number
  projectId: number
  attributes?: ReturnType<typeof useDraggable>["attributes"]
  listeners?: ReturnType<typeof useDraggable>["listeners"]
}

const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(
  ({ name, projectId, taskId, attributes, listeners }, ref) => {
    return (
      // TODO: Find a good solution to open task when clicked that works with dnd Link not working
      <div className="rounded bg-base-200 p-4" ref={ref} {...attributes}>
        {/* Drag handle added to the header */}
        <div className="flex flex-row" {...listeners}>
          {/* TODO: Might not be the best icon for the job */}
          <Bars3Icon className="h-6 w-6 mr-2" />
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
)

export default TaskCard
