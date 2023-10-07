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
} from "@dnd-kit/core"
import { setQueryData } from "@blitzjs/rpc"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"

import updateTask from "../mutations/updateTask"

interface TaskBoardProps extends HTMLAttributes<HTMLElement>, ClassAttributes<HTMLElement> {
  projectId: number
}

const TaskBoard = ({ projectId }: TaskBoardProps) => {
  // Get all the columns for the project
  // TODO: question, do we want pagination for columns? how would that look like?
  const [columns] = useQuery(getColumns, {
    orderBy: { id: "asc" },
    where: { project: { id: projectId! } },
  })

  // Handle drag and drop
  const [updateTaskMutation] = useMutation(updateTask)

  const [isDropped, setIsDropped] = useState(false)

  // Return each column iteratively
  return (
    <div className="flex flex-row justify-center space-x-10">
      <DndContext onDragEnd={handleDragEnd}>
        {columns.map((column) => (
          <TaskColumn column={column} key={column.id} />
        ))}
      </DndContext>
    </div>
  )

  async function handleDragEnd(event) {
    const { active, over } = event
    // This is a bit wasteful because if the task is dropped back in the
    // original column the mutation still runs
    // Also I have to get all the task data for the update because of the
    // taskUpdate mutation schema
    // const values = {
    //   id: parseInt(active.id.match(/\d+/)),
    //   columnId: parseInt(over.id.match(/\d+/)),
    // }
    // try {
    //   const updated = await updateTaskMutation({
    //     ...values,
    //   })
    //   // await setQueryData(updated)
    // } catch (error: any) {
    //   console.error(error)
    // }
  }
}

export default TaskBoard
