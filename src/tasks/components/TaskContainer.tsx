import React from "react"
import ContainerProps from "./container.type"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import clsx from "clsx"
import { Bars2Icon } from "@heroicons/react/24/outline"

const TaskContainer = ({ id, children, title, description, onAddItem }: ContainerProps) => {
  const { attributes, setNodeRef, listeners, transform, transition, isDragging } = useSortable({
    id: id,
    data: {
      type: "container",
    },
  })
  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        "w-full h-full p-4 bg-base-300 rounded-xl flex flex-col gap-y-4 hover:border-accent-content cursor-pointer",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <h1 className="text-xl">{title}</h1>
          <p className="text-sm">{description}</p>
        </div>
        <Bars2Icon className="w-5 h-5" {...listeners}></Bars2Icon>
      </div>

      {children}
      <button type="button" className="btn btn-primary" onClick={onAddItem}>
        Add Item
      </button>
    </div>
  )
}

export default TaskContainer
