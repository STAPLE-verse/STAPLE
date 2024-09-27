import { Status, TaskLog } from "db"

// Preprocessing tasks data for tables
// All Tasks Table
export type ProcessedAllTasks = {
  name: string
  projectName: string
  deadline: Date | null
  completion: number
  view: {
    taskId: number
    projectId: number
  }
}

type Project = {
  id: number
  name: string // Add other relevant fields as necessary
}

type Task = {
  id: number
  createdAt: Date
  updatedAt: Date
  createdById: number
  deadline: Date | null
  name: string
  description: string | null
  tags: string | null
  containerTaskOrder: number
  projectId: number
  project?: Project // Include project as an optional field
  status: Status
}

type TaskLogWithTask = TaskLog & {
  task: Task
}

export function processAllTasks(latestTaskLog: TaskLogWithTask[]): ProcessedAllTasks[] {
  const taskSummary: Record<number, { total: number; completed: number }> = {}

  // Initialize the summary for each taskLog
  latestTaskLog.forEach((log) => {
    const { taskId, status } = log

    // Initialize the summary for this taskId if it doesn't exist
    if (!taskSummary[taskId]) {
      taskSummary[taskId] = { total: 0, completed: 0 }
    }

    // Increment the total count
    taskSummary[taskId].total += 1

    // Increment the completed count if the status is "COMPLETED"
    if (status === "COMPLETED") {
      taskSummary[taskId].completed += 1
    }
  })

  // Generate the final result array
  const processedTasks: ProcessedAllTasks[] = Object.keys(taskSummary).map((taskId) => {
    const taskData = taskSummary[Number(taskId)]

    // Ensure taskData is defined
    if (!taskData) {
      return {
        name: "Unknown Task",
        projectName: "Unknown Project",
        deadline: null,
        completion: 0,
        view: {
          taskId: 0,
          projectId: 0,
        },
      }
    }

    const { total, completed } = taskData
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0

    // Find the corresponding task log
    const taskLog = latestTaskLog.find((log) => log.taskId === Number(taskId))
    const task = taskLog?.task // Assuming task is part of the log

    return {
      name: task?.name || "Unknown Task",
      projectName: task?.project!.name || "Unknown Project",
      deadline: task?.deadline || null,
      completion: completionPercentage,
      view: {
        taskId: task?.id || 0,
        projectId: task?.projectId || 0,
      },
    }
  })

  return processedTasks
}

// Finshed tasks table
export type ProcessedFinishedTasks = {
  name: string
  roles: string
  completedOn: Date
  view: {
    taskId: number
    projectId: number
  }
}

export function processFinishedTasks(tasks): ProcessedFinishedTasks[] {
  return tasks.map((task) => {
    const roles = task.roles
    const roleNames =
      roles && roles.length > 0 ? roles.map((role) => role.name).join(", ") : "No roles added"

    // TODO: Update this to make it safer
    const latestLog = task.taskLogs?.[0]

    const completedOn = latestLog?.status === "COMPLETED" ? latestLog.createdAt : null

    return {
      name: task.name,
      roles: roleNames,
      completedOn: completedOn,
      view: {
        taskId: task.id,
        projectId: task.projectId,
      },
    }
  })
}

// Project task table
export type ProcessedProjectTasks = {
  name: string
  description: string
  deadline: Date | null
  status: string
  view: {
    taskId: number
    projectId: number
  }
}

export function processProjectTasks(tasks): ProcessedProjectTasks[] {
  return tasks.map((task) => ({
    name: task.name,
    description: task.description ? task.description.substring(0, 50) : "No Description",
    deadline: task.deadline,
    status: task.status === Status.COMPLETED ? "Completed" : "Not completed",
    view: {
      taskId: task.id,
      projectId: task.projectId,
    },
  }))
}

// Element task table
export type ProcessedElementTasks = {
  name: string
  deadline: Date | null
  status: string
  view: {
    taskId: number
    projectId: number
  }
}

export function processElementTasks(tasks): ProcessedElementTasks[] {
  return tasks.map((task) => ({
    name: task.name,
    deadline: task.deadline,
    status: task.status === Status.COMPLETED ? "Completed" : "Not completed",
    view: {
      taskId: task.id,
      projectId: task.projectId,
    },
  }))
}
