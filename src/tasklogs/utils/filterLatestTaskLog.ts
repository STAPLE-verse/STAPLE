import { ExtendedTaskLog } from "src/tasklogs/hooks/useTaskLogData"

// Function to get the latest task log from an array of task logs based on the createdAt date
export function filterLatestTaskLog(taskLogs: ExtendedTaskLog[]): ExtendedTaskLog | undefined {
  // Check if the input array is empty and return undefined if so
  if (taskLogs.length === 0) {
    return undefined
  }

  // Use reduce to find the latest task log based on createdAt
  return taskLogs.reduce((latestLog, currentLog) => {
    return new Date(currentLog.createdAt) > new Date(latestLog.createdAt) ? currentLog : latestLog
  }, taskLogs[0] as ExtendedTaskLog)
}
