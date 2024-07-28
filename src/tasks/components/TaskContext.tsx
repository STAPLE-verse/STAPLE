import React, { createContext, ReactNode } from "react"
import { useQuery } from "@blitzjs/rpc"
import getTask from "src/tasks/queries/getTask"
import useAssignmentData from "src/assignments/hooks/useAssignmentData"
import { Task, Column, Element } from "db"
import { AssignmentProgressType } from "src/assignments/queries/getAssignmentProgress"
import useAssignmentProgress from "src/assignments/hooks/useAssignmentProgress"
import { ExtendedAssignment } from "src/assignments/hooks/useAssignmentData"

// Creating custom types
export type ExtendedTask = Task & {
  column: Column
  element: Element | null
  assignees: ExtendedAssignment[]
}

interface TaskContextType {
  task: ExtendedTask | null
  assignmentProgress: AssignmentProgressType | null
  individualAssignments: ExtendedAssignment[]
  teamAssignments: ExtendedAssignment[]
  refetchTaskData: () => void
}

// Creating props interface
interface TaskProviderProps {
  taskId: number
  projectId: number
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
      column: true,
      assignees: {
        include: {
          contributor: true,
          team: {
            include: {
              contributors: true,
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
  const assignmentProgress = useAssignmentProgress(task)
  const { individualAssignments, teamAssignments } = useAssignmentData(task)

  if (!task) {
    return <div>Loading...</div>
  }

  // Set context value
  const contextValue = {
    task,
    assignmentProgress,
    individualAssignments,
    teamAssignments,
    refetchTaskData,
  }

  return <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
}
