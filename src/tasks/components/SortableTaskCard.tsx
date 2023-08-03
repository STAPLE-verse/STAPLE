import React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import TaskCard from "./TaskCard"

interface SortableTaskCardProps {
  taskId: number
}

export default function SortableTaskCard({ taskId }: SortableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: taskId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard taskId={taskId} />
    </div>
  )
}
