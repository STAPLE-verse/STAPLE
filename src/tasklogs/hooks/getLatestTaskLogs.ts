import { TaskLog } from "db"

// Generic function that returns the latest task logs based on the specified type T
export default function getLatestTaskLogs<T extends TaskLog>(taskLog: T[]): T[] {
  const latestTaskLogs = taskLog.reduce((acc, log) => {
    // Create a unique key for each taskId and projectMemberId combination
    const key = `${log.taskId}-${log.assignedToId}`
    const existingLog = acc[key]

    // Check if this log is more recent than the existing one for the key
    if (!existingLog || new Date(log.createdAt) > new Date(existingLog.createdAt)) {
      acc[key] = log
    }

    return acc
  }, {} as Record<string, T>)

  return Object.values(latestTaskLogs)
}
