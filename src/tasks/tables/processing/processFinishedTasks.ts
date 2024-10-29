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

export function processFinishedTasks(tasks): FinishedTasksData[] {
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
