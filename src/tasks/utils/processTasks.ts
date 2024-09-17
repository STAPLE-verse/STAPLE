import { Status } from "db"
import { getLatestTaskLogs } from "src/tasklogs/utils/getLatestTaskLogs"

// Preprocessing tasks data for tables
// All tasks table
export type ProcessedAllTasks = {
  name: string
  projectName: string
  deadline: Date | null
  completition: number
  view: {
    taskId: number
    projectId: number
  }
}

export function processAllTasks(tasks): ProcessedAllTasks[] {
  return tasks.map((task) => {
    const assignments = task.assignees

    // Get the latest status log for each assignment and calculate the number of completed assignments
    const completedAssignments = assignments.reduce((count, assignment) => {
      const latestLog = getLatestTaskLog(assignment.statusLogs)
      if (latestLog?.status === AssignmentStatus.COMPLETED) {
        return count + 1
      }
      return count
    }, 0)

    // Calculate the percentage of completed assignments
    const completionPercentage =
      assignments.length > 0 ? Math.round((completedAssignments / assignments.length) * 100) : 0

    return {
      name: task.name,
      projectName: task.project.name,
      deadline: task.deadline,
      completition: completionPercentage,
      view: {
        taskId: task.id,
        projectId: task.projectId,
      },
    }
  })
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
    const completedOn = task.assignees[0].statusLogs[0].createdAt

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
