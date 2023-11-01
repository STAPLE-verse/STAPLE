import React from "react"
import { CSS } from "@dnd-kit/utilities"

import TaskCard from "./TaskCard"
import { useDraggable } from "@dnd-kit/core"

interface DraggableTaskCardProps {
  name: string
  taskId: number
  projectId: number
  disable?: boolean
}

export default function DraggableTaskCard({
  name,
  projectId,
  taskId,
  disable,
}: DraggableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `task-${taskId}`,
    // disable should be true when user interacts with Open button
    disabled: disable,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
  }

  return (
    <TaskCard
      attributes={attributes}
      listeners={listeners}
      ref={setNodeRef}
      style={style}
      taskId={taskId}
      name={name}
      projectId={projectId}
    />
  )
}
