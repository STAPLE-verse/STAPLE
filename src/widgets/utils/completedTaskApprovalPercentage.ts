import { TaskLog, Task } from "db"

type TaskLogWithTask = TaskLog & {
  task: Task
}

export const completedTaskApprovalPercentage = (
  taskLogs: TaskLogWithTask[] | null | undefined
): number => {
  // Check if taskLogs is null or undefined
  if (!taskLogs || taskLogs.length === 0) {
    return -1
  }

  const completedTaskLogs = taskLogs.filter((taskLog) => taskLog.approved === true)
  return completedTaskLogs.length / taskLogs.length
}
