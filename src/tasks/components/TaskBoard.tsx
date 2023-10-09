import React, { useState } from "react"
import { HTMLAttributes, ClassAttributes } from "react"
import TaskColumn from "./TaskColumn"
import { useQuery, useMutation } from "@blitzjs/rpc"
import getColumns from "../queries/getColumns"
import { Column, Task } from "db"
import { DndContext } from "@dnd-kit/core"
import { setQueryData } from "@blitzjs/rpc"

import updateTask from "../mutations/updateTask"

interface TaskBoardProps extends HTMLAttributes<HTMLElement>, ClassAttributes<HTMLElement> {
  projectId: number
}

interface ColumnWithTasks extends Column {
  tasks: Task[] // Assuming "Task" is the type for tasks
}

const TaskBoard = ({ projectId }: TaskBoardProps) => {
  // Get all the columns for the project
  // TODO: question, do we want pagination for columns? how would that look like?
  // I am not sure this is a good way to do this...
  const [columns]: [ColumnWithTasks[], any] = useQuery(getColumns, {
    orderBy: { id: "asc" },
    where: { project: { id: projectId! } },
    include: { tasks: true },
  })

  // Handle drag and drop
  const [updateTaskMutation] = useMutation(updateTask)

  const [isDropped, setIsDropped] = useState(false)

  // Return each column iteratively
  return (
    <div className="flex flex-row justify-center space-x-10">
      <DndContext onDragEnd={handleDragEnd}>
        {columns.map((column) => (
          <TaskColumn column={column} key={column.id} tasks={column.tasks} />
        ))}
      </DndContext>
    </div>
  )

  async function handleDragEnd(event) {
    // Sorry for this spagetthi of a code...
    const { active, over } = event
    console.log({ active, over })
    // This is a bit wasteful because if the task is dropped back in the
    // original column the mutation still runs
    // Also I have to get all the task data for the update because of the
    // taskUpdate mutation schema
    const taskId = parseInt(active.id.match(/\d+/))
    const newColumnId = parseInt(over.id.match(/\d+/))

    function findTaskById(columns, taskId) {
      for (const column of columns) {
        const foundTask = column.tasks.find((task) => task.id === taskId)
        if (foundTask) {
          return foundTask
        }
      }
      return null
    }
    try {
      const activeTask = findTaskById(columns, taskId)
      if (activeTask.columnId !== newColumnId) {
        activeTask.columnId = newColumnId
        // For some reason  updateTask schema does not recognize description optional
        // TODO: fix this
        if (activeTask.description === null) {
          activeTask.description = ""
        }
        await updateTaskMutation({
          ...activeTask,
        })
        // await setQueryData(updated)
      }
    } catch (error: any) {
      console.error(error)
    }
  }
}

export default TaskBoard
