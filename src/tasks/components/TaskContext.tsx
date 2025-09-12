import { useEffect } from "react"
import { eventBus } from "src/core/utils/eventBus"
import React, { createContext, ReactNode, useContext, useState } from "react"
import { useQuery } from "@blitzjs/rpc"
import getTask from "src/tasks/queries/getTask"
import { ExtendedTask, ProjectMemberWithTaskLog } from "src/core/types"
import useTaskLogProgress from "src/tasklogs/hooks/useTaskLogProgress"

interface TaskContextType {
  task: ExtendedTask
  projectMembers: ProjectMemberWithTaskLog[]
  refetchTaskData: () => void
  taskLogProgress: ReturnType<typeof useTaskLogProgress>
}

// Creating props interface
interface TaskProviderProps {
  taskId: number
  children?: ReactNode
}

// Creating the context
export const TaskContext = createContext<TaskContextType | null>(null)

// Provider component
export const TaskProvider = ({ taskId, children }: TaskProviderProps) => {
  // Fetch data
  const [task, { refetch: refetchTaskData }] = useQuery(getTask, {
    where: { id: taskId },
    include: {
      milestone: true,
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

  const [version, setVersion] = useState(0)
  const taskLogProgress = useTaskLogProgress([...task.assignedMembers])

  useEffect(() => {
    const handleUpdate = () => {
      void refetchTaskData()
      setVersion((v) => v + 1)
    }
    eventBus.on("taskLogUpdated", handleUpdate)
    return () => eventBus.off("taskLogUpdated", handleUpdate)
  }, [refetchTaskData])

  // Set context value
  const contextValue = {
    task,
    projectMembers: task.assignedMembers,
    refetchTaskData,
    taskLogProgress,
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
