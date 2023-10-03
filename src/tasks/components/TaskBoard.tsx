import React, { useState } from "react"
import { HTMLAttributes, ClassAttributes } from "react"
import TaskColumn from "./TaskColumn"
import { useQuery, useMutation } from "@blitzjs/rpc"
import getColumns from "../queries/getColumns"
import TaskCard from "./TaskCard"

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"

import updateTaskOrder from "../mutations/updateTaskOrder"

interface TaskBoardProps extends HTMLAttributes<HTMLElement>, ClassAttributes<HTMLElement> {
  projectId: number
}

const TaskBoard = ({ projectId }: TaskBoardProps) => {
  // Get all the columns for the project
  // TODO: question, do we want nem jól sajnopagination for columns? how would that look like?
  const [columns] = useQuery(getColumns, {
    orderBy: { id: "asc" },
    where: { project: { id: projectId! } },
  })

  // Handle drag and drop
  const [updateTaskOrderMutation] = useMutation(updateTaskOrder)

  const [activeId, setActiveId] = useState(null)

  // Setup sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Return each column iteratively
  return (
    <div className="flex flex-row justify-center space-x-10">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        {columns.map((column) => (
          <TaskColumn column={column} key={column.id} columnId={column.id} />
        ))}
        <DragOverlay>{activeId ? <TaskCard taskId={activeId} /> : null}</DragOverlay>
      </DndContext>
    </div>
  )

  function handleDragStart(event) {
    const { active } = event
    setActiveId(active.id)
  }

  async function handleDragEnd(event) {
    const { active, over } = event
    console.log({ active, over })

    // if (active.id !== over.id) {
    //   try {
    //     // Call the updateTaskOrder mutation to reorder the tasks
    //     await updateTaskOrderMutation({
    //       activeId: active.id,
    //       overId: over.id,
    //     })
    //     console.log("Yay!")
    //   } catch (error) {
    //     // Handle any error that might occur during the mutation
    //     console.error("Error updating task order:", error)
    //   }
    // }
    setActiveId(null)
  }
}

export default TaskBoard
