import React, { createContext, ReactNode, useContext } from "react"
import { useQuery } from "@blitzjs/rpc"
import getTask from "src/tasks/queries/getTask"
import { ExtendedTask, ProjectMemberWithTaskLog } from "src/core/types"

interface TaskContextType {
  task: ExtendedTask
  projectMembers: ProjectMemberWithTaskLog[]
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
      assignedMembers: {
        include: {
          taskLogAssignedTo: {
            where: {
              taskId: taskId, // Filter task logs by the current taskId
            },
            include: {
              completedBy: {
                include: {
                  users: true,
                },
              },
              assignedTo: {
                include: {
                  users: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          users: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  }) as [ExtendedTask, any]

  // Set context value
  const contextValue = {
    task,
    projectMembers: task.assignedMembers,
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
