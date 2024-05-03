import { UniqueIdentifier } from "@dnd-kit/core"
import { useSortable } from "@dnd-kit/sortable"
import React from "react"
import { CSS } from "@dnd-kit/utilities"
import clsx from "clsx"
import { Bars3Icon } from "@heroicons/react/24/outline"

type ItemsType = {
  id: UniqueIdentifier
  title: string
}

const TaskItems = ({ id, title }: ItemsType) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: id,
    data: {
      type: "item",
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
        "px-2 py-4 bg-accent shadow-md rounded-xl w-full border border-transparent hover:border-accent-content cursor-pointer",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-center justify-between">
        <b className="text-accent-content">{title}</b>
        <Bars3Icon className="w-5 h-5" {...listeners}></Bars3Icon>
      </div>
    </div>
  )
}

export default TaskItems
