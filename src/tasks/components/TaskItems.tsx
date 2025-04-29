import { useSortable } from "@dnd-kit/sortable"
import React from "react"
import { CSS } from "@dnd-kit/utilities"
import clsx from "clsx"
import { MagnifyingGlassPlusIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowsUpDownLeftRight } from "@fortawesome/free-solid-svg-icons"
import { makeDragId } from "../utils/dragId"

type ItemsType = {
  id: number
  title: string
  completed: boolean
  projectId: number
  containerId: number
}

const TaskItems = ({ id, title, completed, projectId, containerId }: ItemsType) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: makeDragId("item", id),
    data: {
      type: "item",
      taskId: id,
      columnId: containerId,
    },
  })

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
        completed ? "bg-success" : "bg-accent"
      )}
    >
      <div className="flex items-center justify-between">
        <b className="text-accent-content">{title}</b>
        <div className="flex justify-end items-center">
          <Link href={Routes.ShowTaskPage({ projectId: projectId, taskId: id })}>
            <MagnifyingGlassPlusIcon className="w-7 h-7 mr-2 stroke-2 stroke-neutral border-transparent rounded-2xl shadow-sm hover:opacity-50"></MagnifyingGlassPlusIcon>
          </Link>
          <FontAwesomeIcon
            icon={faArrowsUpDownLeftRight}
            className="w-6 h-6 text-neutral border-transparent rounded-2xl hover:opacity-50"
            {...listeners}
          />
        </div>
      </div>
    </div>
  )
}

export default TaskItems
