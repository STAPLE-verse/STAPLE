import { UniqueIdentifier } from "@dnd-kit/core"
import { useSortable } from "@dnd-kit/sortable"
import React from "react"
import { CSS } from "@dnd-kit/utilities"
import clsx from "clsx"
import { Bars3Icon, EllipsisHorizontalCircleIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { Routes } from "@blitzjs/next"

type ItemsType = {
  id: string
  title: string
  completed: boolean
  projectId: number
}

const TaskItems = ({ id, title, completed, projectId }: ItemsType) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: id,
    data: {
      type: "item",
    },
  })
  const taskId = parseInt(id.replace("item-", ""))
  // console.log(completed)
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        "px-2 py-4 shadow-md rounded-xl w-full border border-transparent hover:border-accent-content cursor-pointer",
        isDragging && "opacity-50",
        completed ? "bg-accent" : "bg-warning"
      )}
    >
      <div className="flex items-center justify-between">
        <b className="text-accent-content">{title}</b>
        <div className="flex justify-end items-center">
          <Link
            href={Routes.ShowTaskPage({ projectId: projectId, taskId: taskId })}
            // data-dnd-drag-handle="true"
          >
            <EllipsisHorizontalCircleIcon className="w-5 h-5 mr-2 border-transparent rounded-2xl shadow-sm hover:opacity-50"></EllipsisHorizontalCircleIcon>
          </Link>
          <Bars3Icon className="w-5 h-5" {...listeners}></Bars3Icon>
        </div>
      </div>
    </div>
  )
}

export default TaskItems
