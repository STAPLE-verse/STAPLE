import db, { TaskLog } from "db"

// taskLogService.ts (for example)
export const getLatestTaskLogs = async () => {
  const taskLogs = await db.taskLog.findMany({
    include: { task: true },
  })

  const latestTaskLogs = taskLogs.reduce((acc, log) => {
    // Initialize the user entry if it does not exist
    if (!acc[log.assignedToId]) {
      acc[log.assignedToId] = {}
    }

    // Retrieve the existing log for this user-task combination
    const existingLog = acc[log.assignedToId]?.[log.taskId]

    // Check if the current log is more recent
    if (!existingLog || new Date(log.createdAt) > new Date(existingLog.createdAt)) {
      acc[log.assignedToId][log.taskId] = log
    }

    return acc
  }, {} as Record<number, Record<number, TaskLog>>) // Adjust types as necessary

  // Flatten the nested structure to get an array of logs
  const flattenedTaskLogs = Object.values(latestTaskLogs).flatMap((userLogs) =>
    Object.values(userLogs)
  )

  return flattenedTaskLogs
}
