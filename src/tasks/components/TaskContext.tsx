import React, { createContext, useState, useEffect } from "react"
import { useQuery, useMutation } from "@blitzjs/rpc"
import getTask from "src/tasks/queries/getTask"
import getAssignmentProgress from "src/assignments/queries/getAssignmentProgress"
import useAssignmentData from "src/assignments/hooks/useAssignmentData"
import { Task, Column, Element } from "db"
import { AssignmentProgressType } from "src/assignments/queries/getAssignmentProgress"
import { AssignmentsType } from "src/assignments/hooks/useAssignmentData"

// Creating custom types
type ExtendedTask = Task & {
  element?: Element | null
  column?: Column | null
}

interface TaskContextType {
  task: ExtendedTask | null
  assignmentProgress: AssignmentProgressType | null
  individualAssignments: AssignmentsType[]
  teamAssignments: AssignmentsType[]
  refetchCurrentAssignments: () => void
}

// Creating the context
export const TaskContext = createContext<TaskContextType | null>(null)

// Provider component
export const TaskProvider = ({ taskId, projectId, children }) => {
  // Set states
  const [task, setTask] = useState<ExtendedTask | null>(null)
  const [assignmentProgress, setAssignmentProgress] = useState<AssignmentProgressType | null>(null)

  // Fetch data
  const [taskData] = useQuery(getTask, {
    id: taskId,
    include: { element: true, column: true },
  })
  const [assignmentProgressData] = useQuery(getAssignmentProgress, { taskId })
  const { individualAssignments, teamAssignments, refetchCurrentAssignments } = useAssignmentData(
    taskId,
    projectId
  )
  // console.log({ taskData })
  // Update states
  useEffect(() => {
    console.log(taskData)
    if (taskData) {
      setTask(taskData)
    }
  }, [taskData])

  useEffect(() => {
    if (setAssignmentProgress) {
      setAssignmentProgress(assignmentProgressData)
    }
  }, [assignmentProgressData])

  // Set context value
  const contextValue = {
    task,
    assignmentProgress,
    individualAssignments,
    teamAssignments,
    refetchCurrentAssignments,
  }

  return <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
}
