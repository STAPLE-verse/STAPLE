import { ExtendedTaskLog } from "src/core/types"

// Function to get the first task log from an array of task logs based on the createdAt date
export function filterFirstTaskLog(taskLogs: ExtendedTaskLog[]): ExtendedTaskLog | undefined {
  if (taskLogs.length === 0) return undefined

  // Sort the task logs by createdAt in ascending order and return the first one
  return [...taskLogs].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )[0]
}
