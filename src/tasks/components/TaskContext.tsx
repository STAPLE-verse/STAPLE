import React, { createContext, ReactNode, useContext } from "react"
import { useQuery } from "@blitzjs/rpc"
import getTask from "src/tasks/queries/getTask"
import useTaskLogData from "src/tasklogs/hooks/useTaskLogData"
import { Task, KanbanBoard, Element, FormVersion } from "db"
import { ExtendedTaskLog } from "src/tasklogs/hooks/useTaskLogData"

// Creating custom types
export type ExtendedTask = Task & {
  container: KanbanBoard
  element: Element | null
  formVersion: FormVersion | null
  taskLogs: ExtendedTaskLog[]
  roles: []
}

interface TaskContextType {
  task: ExtendedTask
  individualTaskLogs: ExtendedTaskLog[]
  teamTaskLogs: ExtendedTaskLog[]
  refetchTaskData: () => void
}

// Creating props interface
interface TaskProviderProps {
  taskId: number
  children: ReactNode
}

// Creating the context
export const TaskContext = createContext<TaskContextType | null>(null)

// Provider component
export const TaskProvider = ({ taskId, children }: TaskProviderProps) => {
  // Fetch data
  const [task, { refetch: refetchTaskData }] = useQuery(getTask, {
    where: { id: taskId },
    include: {
      element: true,
      container: true,
      formVersion: true,
      roles: true,
      taskLogs: {
        include: {
          // Include the username for the ProjectMembers assigned to the Task
          assignedTo: { include: { users: { select: { id: true, username: true } } } },
        },
      },
    },
  }) as [ExtendedTask, any]

  // Filter data
  const { individualTaskLogs, teamTaskLogs } = useTaskLogData(task)

  // Set context value
  const contextValue = {
    task,
    individualTaskLogs,
    teamTaskLogs,
    refetchTaskData,
  }

  return <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
}

export const useTaskContext = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider")
  }
  return context
}
