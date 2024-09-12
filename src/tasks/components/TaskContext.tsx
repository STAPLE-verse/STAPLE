import React, { createContext, ReactNode, useContext } from "react"
import { useQuery } from "@blitzjs/rpc"
import getTask from "src/tasks/queries/getTask"
import useAssignmentData from "src/assignments/hooks/useAssignmentData"
import { Task, KanbanBoard, Element, FormVersion } from "db"
import { ExtendedAssignment } from "src/assignments/hooks/useAssignmentData"

// Creating custom types
export type ExtendedTask = Task & {
  container: KanbanBoard
  element: Element | null
  formVersion: FormVersion | null
  assignees: ExtendedAssignment[]
  labels: []
}

interface TaskContextType {
  task: ExtendedTask
  individualAssignments: ExtendedAssignment[]
  teamAssignments: ExtendedAssignment[]
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
      assignees: {
        include: {
          contributor: { include: { user: { select: { username: true } } } },
          team: {
            include: {
              contributors: {
                include: {
                  user: { select: { username: true } },
                },
              },
            },
          },
          statusLogs: {
            orderBy: { createdAt: "desc" },
            include: { contributor: { include: { user: { select: { username: true } } } } },
          },
        },
      },
    },
  }) as [ExtendedTask, any]

  // Filter data
  const { individualAssignments, teamAssignments } = useAssignmentData(task)

  // Set context value
  const contextValue = {
    task,
    individualAssignments,
    teamAssignments,
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
