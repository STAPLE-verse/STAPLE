import { Task, TaskLog } from "db"

type TaskLogWithTask = TaskLog & {
  task: Task
}

export default function getLatestTaskLogs(taskLog: TaskLog[]) {
  const latestTaskLogs = taskLog.reduce((acc, log) => {
    // Unique key for each taskId and projectMemberId combination
    const key = `${log.taskId}-${log.assignedToId}`
    const existingLog = acc[key]

    if (!existingLog || new Date(log.createdAt) > new Date(existingLog.createdAt)) {
      acc[key] = log as TaskLogWithTask // Type assertion
    }

    return acc
  }, {} as Record<string, TaskLogWithTask>)

  return Object.values(latestTaskLogs)
}
