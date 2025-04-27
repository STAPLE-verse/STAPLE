import React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import clsx from "clsx"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowsUpDownLeftRight } from "@fortawesome/free-solid-svg-icons"
import { UniqueIdentifier } from "@dnd-kit/core"

interface ContainerProps {
  id: UniqueIdentifier
  children?: React.ReactNode
  title?: string
  description?: string
}

const TaskContainer = ({ id, children, title, description }: ContainerProps) => {
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
        "w-full h-full p-4 bg-base-100 rounded-xl flex flex-col gap-y-4 hover:border-accent-content cursor-pointer p-4",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <h1 className="text-xl">{title}</h1>
          <p className="text-base">{description}</p>
        </div>
        <FontAwesomeIcon
          icon={faArrowsUpDownLeftRight}
          className="w-6 h-6 text-base-content border-transparent rounded-2xl hover:opacity-50 draggable"
          {...listeners}
        />
      </div>

      {children}
    </div>
  )
}

export default TaskContainer
