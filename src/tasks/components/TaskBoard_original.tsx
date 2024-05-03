import React, { useState } from "react"
import { HTMLAttributes, ClassAttributes } from "react"
import TaskColumn from "./TaskColumn"
import { useQuery, useMutation } from "@blitzjs/rpc"
import getColumns from "../queries/getColumns"
import { Column, Task } from "db"
import type { PointerEvent } from "react"
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"

import updateTask from "../mutations/updateTask"
import TaskCard from "./TaskCard"

interface TaskBoardProps extends HTMLAttributes<HTMLElement>, ClassAttributes<HTMLElement> {
  projectId: number
}

interface ColumnWithTasks extends Column {
  tasks: Task[] // Assuming "Task" is the type for tasks
}

const TaskBoard = ({ projectId }: TaskBoardProps) => {
  // TODO: columnTaskIndex task parameter is currently not used due to the lack of sortable
  // Get all the columns for the project
  // TODO: question, do we want pagination for columns? how would that look like?
  // I am not sure what is a good way to define column with task interface without making extra fetch info type any
  const [columns, { refetch }]: [ColumnWithTasks[], any] = useQuery(getColumns, {
    orderBy: { id: "asc" },
    where: { project: { id: projectId! } },
    include: { tasks: true },
  })

  // Handle drag and drop
  const [updateTaskMutation] = useMutation(updateTask)

  const [isDropped, setIsDropped] = useState(false)

  type TaskOrNull = Task | null
  const [activeTask, setActiveTask] = useState<TaskOrNull>(null)

  // Custom sensor to prevent drag and drop on click
  class NoActivePointerSensor extends PointerSensor {
    static activators = [
      {
        eventName: "onPointerDown" as const,
        handler: ({
          nativeEvent: event,
        }: PointerEvent): // { onActivation }: PointerSensorOptions
        boolean => {
          if (!event.isPrimary || event.button !== 0 || isInteractiveElement(event.target)) {
            return false
          }

          return true
        },
      },
    ]
  }

  function isInteractiveElement(element) {
    // Elements that are NOT draggable
    const interactiveElements = ["button", "input", "textarea", "select", "option", "a"]

    if (interactiveElements.includes(element.tagName.toLowerCase())) {
      return true
    }

    return false
  }

  const sensors = useSensors(
    // useSensor(MouseSensor),
    useSensor(NoActivePointerSensor)
  )

  // Return each column iteratively
  return (
    <div className="flex flex-row justify-center space-x-10 h-full">
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        sensors={sensors}
      >
        {columns.map((column) => {
          return <TaskColumn column={column} key={column.id} tasks={column.tasks} />
        })}
        <DragOverlay
          // TODO: Dropanimation returns the dragged component to the original position
          // TODO: to solve this I believe we have to have a state management on the client side instead of
          // TODO: relying solely on the server with useQuery
          dropAnimation={null}
        >
          {activeTask ? (
            <TaskCard
              taskId={activeTask.id}
              key={activeTask.id}
              name={activeTask.name}
              projectId={activeTask.projectId}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )

  function findTaskById(columns, taskId) {
    for (const column of columns) {
      const foundTask = column.tasks.find((task) => task.id === taskId)
      if (foundTask) {
        return foundTask
      }
    }
    return null
  }

  function handleDragStart(event) {
    const activeId = parseInt(event.active.id.match(/\d+/))
    const activeTask = findTaskById(columns, activeId)
    setActiveTask(activeTask)
  }

  function handleDragOver(event) {}

  async function handleDragEnd(event) {
    // Sorry for this spagetthi of a code...
    const { active, over } = event

    if (!over) {
      setActiveTask(null)
      return
    }
    // This is a bit wasteful because if the task is dropped back in the
    // original column the mutation still runs
    // Also I have to get all the task data for the update because of the
    // taskUpdate mutation schema
    const newColumnId = parseInt(over.id.match(/\d+/))
    try {
      if (activeTask !== null && activeTask.columnId !== newColumnId) {
        activeTask.columnId = newColumnId

        await updateTaskMutation({
          ...activeTask,
        })
        setActiveTask(null)
        // Refecth tasks for board
        refetch()
      }
    } catch (error: any) {
      console.error(error)
    }
  }
}

export default TaskBoard_original
