import React from "react"
import { HTMLAttributes, ClassAttributes } from "react"
import { KanbanBoard, Task } from "db"
import { useDroppable } from "@dnd-kit/core"
import DraggableTaskCard from "./DraggableTaskCard"

interface TaskColumnProps extends HTMLAttributes<HTMLElement>, ClassAttributes<HTMLElement> {
  column: KanbanBoard
  tasks: Task[]
}

// Set the maximum number of tasks to return for the column
// TODO: Extend logic should be added or pagination to the UI
const TaskColumn = ({ column, tasks }: TaskColumnProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `column-${column.id}`,
  })

  const style = {
    boxShadow: isOver ? "0 0 8px gray" : undefined,
  }

  // Return individual task cards for the column
  return (
    <div className="flex flex-col flex-1 bg-gray-300 p-4 rounded-lg shadow-md">
      <h1>{column.name}</h1>
      <div
        ref={setNodeRef}
        style={style}
        className="flex flex-col flex-grow h-full space-y-6 p-3 rounded-lg"
      >
        {tasks.map((task) => (
          <DraggableTaskCard
            taskId={task.id}
            key={task.id}
            name={task.name}
            projectId={task.projectId}
          />
        ))}
      </div>
    </div>
  )
}

export default TaskColumn
