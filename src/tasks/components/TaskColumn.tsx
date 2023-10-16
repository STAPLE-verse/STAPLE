import React from "react"
import { HTMLAttributes, ClassAttributes } from "react"
import { Column, Task } from "db"

import { useRouter } from "next/router"
// import SortableTaskCard from "./SortableTaskCard"
import TaskCard from "./TaskCard"
import { useDroppable, DragOverlay } from "@dnd-kit/core"

interface TaskColumnProps extends HTMLAttributes<HTMLElement>, ClassAttributes<HTMLElement> {
  column: Column
  tasks: Task[]
}

// Set the maximum number of tasks to return for the column
// TODO: Extend logic should be added or pagination to the UI
const ITEMS_PER_PAGE = 10

const TaskColumn = ({ column, tasks }: TaskColumnProps) => {
  // Setup
  const router = useRouter()
  const page = Number(router.query.page) || 0

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
          <TaskCard taskId={task.id} key={task.id} name={task.name} projectId={task.projectId} />
        ))}
      </div>
    </div>
  )
}

export default TaskColumn
