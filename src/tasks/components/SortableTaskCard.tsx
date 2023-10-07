import React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import TaskCard from "./TaskCard"

interface SortableTaskCardProps {
  name: string
  taskId: number
  projectId: number
}

export default function SortableTaskCard({ name, projectId, taskId }: SortableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: taskId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <div {...attributes} {...listeners}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
          />
        </svg>
      </div>
      <TaskCard taskId={taskId} name={name} projectId={projectId} />
    </div>
  )
}
