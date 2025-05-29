import { TaskLogWithTaskProjectAndComments } from "src/core/types"

export type AllTasksData = {
  name: string
  projectName: string
  deadline: Date | null
  completion: number
  hasNewComments: boolean
  newCommentsCount: number
  view: {
    taskId: number
    projectId: number
  }
}

export function processAllTasks(
  latestTaskLog: TaskLogWithTaskProjectAndComments[]
): AllTasksData[] {
  const taskSummary: Record<number, { total: number; completed: number }> = {}

  // Initialize the summary for each taskLog
  latestTaskLog.forEach((log) => {
    const { taskId, status } = log

    // Initialize the summary for this taskId if it doesn't exist
    if (!taskSummary[taskId]) {
      taskSummary[taskId] = { total: 0, completed: 0 }
    }

    // Use type assertion to avoid TypeScript's undefined warning
    ;(taskSummary[taskId] as { total: number; completed: number }).total += 1

    // Increment the completed count if the status is "COMPLETED"
    if (status === "COMPLETED") {
      ;(taskSummary[taskId] as { total: number; completed: number }).completed += 1
    }
  })

  // Generate the final result array
  const processedTasks: AllTasksData[] = Object.keys(taskSummary).map((taskId) => {
    const taskData = taskSummary[Number(taskId)]

    // Ensure taskData is defined
    if (!taskData) {
      return {
        name: "Unknown Task",
        projectName: "Unknown Project",
        deadline: null,
        completion: 0,
        hasNewComments: false,
        newCommentsCount: 0,
        view: {
          taskId: 0,
          projectId: 0,
        },
      }
    }

    const { total, completed } = taskData
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0

    // Find the corresponding task log
    const taskLog = latestTaskLog.find((log) => log.taskId === Number(taskId))
    const task = taskLog?.task // Assuming task is part of the log

    const hasNewComments =
      taskLog?.comments?.some((comment) =>
        comment.commentReadStatus?.some((status) => !status.read)
      ) ?? false

    const newCommentsCount =
      taskLog?.comments?.reduce((count, comment) => {
        return count + (comment.commentReadStatus?.filter((status) => !status.read).length ?? 0)
      }, 0) ?? 0

    return {
      name: task?.name || "Unknown Task",
      projectName: task?.project!.name || "Unknown Project",
      deadline: task?.deadline || null,
      completion: completionPercentage,
      hasNewComments,
      newCommentsCount,
      view: {
        taskId: task?.id || 0,
        projectId: task?.projectId || 0,
      },
    }
  })

  return processedTasks
}
