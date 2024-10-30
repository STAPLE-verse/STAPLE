import { TaskLogWithTaskCompleted } from "src/core/types"

// Finshed tasks table
export type FinishedTasksData = {
  name: string
  roles: string
  completedOn: Date
  view: {
    taskId: number
    projectId: number
  }
}

export function processFinishedTasks(taskLogs: TaskLogWithTaskCompleted[]): FinishedTasksData[] {
  return taskLogs.map((taskLog) => {
    const task = taskLog.task
    const roleNames = task.roles?.length
      ? task.roles.map((role) => role.name).join(", ")
      : "No roles assigned"

    return {
      name: task.name,
      roles: roleNames,
      completedOn: taskLog.createdAt,
      view: {
        taskId: task.id,
        projectId: task.projectId,
      },
    }
  })
}
