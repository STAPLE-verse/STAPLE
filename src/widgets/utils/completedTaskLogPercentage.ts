import { TaskLog, Task, Status } from "db"

type TaskLogWithTask = TaskLog & {
  task: Task
}

export const completedTaskLogPercentage = (
  taskLogs: TaskLogWithTask[] | null | undefined
): number => {
  // Check if taskLogs is null or undefined
  if (!taskLogs || taskLogs.length === 0) {
    return -1
  }

  const completedFormTaskLogs = taskLogs.filter((taskLog) => taskLog.status === Status.COMPLETED)
  return completedFormTaskLogs.length / taskLogs.length
}
