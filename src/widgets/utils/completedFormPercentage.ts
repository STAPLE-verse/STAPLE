import { TaskLog, Task, Status } from "db"

type TaskLogWithTask = TaskLog & {
  task: Task
}

export const completedFormPercentage = (taskLogs: TaskLogWithTask[] | null | undefined): number => {
  // Check if taskLogs is null or undefined
  if (!taskLogs || taskLogs.length === 0) {
    return 0
  }

  const allFormTaskLogs = taskLogs.filter((taskLog) => {
    return taskLog.task.formVersionId !== null
  })

  if (allFormTaskLogs.length > 0) {
    const completedFormTaskLogs = allFormTaskLogs.filter(
      (taskLog) => taskLog.status === Status.COMPLETED
    )

    return completedFormTaskLogs.length / allFormTaskLogs.length
  } else {
    return 0
  }
}
