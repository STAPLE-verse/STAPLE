import { Status } from "db"

// Project task table
export type ProjectTasksData = {
  name: string
  description: string
  container: string
  deadline: Date | null
  status: string
  percentComplete: number
  view: {
    taskId: number
    projectId: number
  }
}

export function processProjectTasks(tasks): ProjectTasksData[] {
  return tasks.map((task) => {
    const logs = task.taskLogs || []

    const latestLogsMap = new Map<number, any>()
    for (const log of logs) {
      const current = latestLogsMap.get(log.assignedToId)
      if (!current || new Date(log.createdAt) > new Date(current.createdAt)) {
        latestLogsMap.set(log.assignedToId, log)
      }
    }

    const latestLogs = Array.from(latestLogsMap.values())
    const completedLogs = latestLogs.filter((log) => log.status === Status.COMPLETED).length
    const totalLogs = latestLogs.length
    const percentComplete = totalLogs > 0 ? Math.round((completedLogs / totalLogs) * 100) : 0

    return {
      name: task.name,
      description: task.description ? task.description.substring(0, 50) : "No Description",
      container: task.container.name,
      deadline: task.deadline,
      status: task.status === Status.COMPLETED ? "Completed" : "Not completed",
      percentComplete,
      view: {
        taskId: task.id,
        projectId: task.projectId,
      },
    }
  })
}
