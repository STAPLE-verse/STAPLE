import { Status } from "db"
import { CommentWithAuthor } from "src/core/types"

// Project task table
export type ProjectTasksData = {
  name: string
  description: string
  container: string
  deadline: Date | null
  status: string
  numberAssigned: number
  formAssigned: number
  percentComplete: number
  percentApproved: number
  newCommentsCount: number
  view: {
    taskId: number
    projectId: number
  }
  comments: CommentWithAuthor[]
  refetchTasks?: () => Promise<void>
  firstLogId?: number
}

export function processProjectTasks(tasks, refetchTasks?: () => Promise<void>): ProjectTasksData[] {
  return tasks.map((task) => {
    const logs = task.taskLogs || []

    const formAssigned = task.formVersionId ? 1 : 0

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

    const approvedLogs = latestLogs.filter((log) => log.approved === true).length
    const percentApproved = totalLogs > 0 ? Math.round((approvedLogs / totalLogs) * 100) : 0

    const newCommentsCount = logs.reduce((total, log) => {
      return (
        total +
        (log.comments?.reduce((sum, comment) => {
          return sum + (comment.commentReadStatus?.filter((status) => !status.read).length ?? 0)
        }, 0) ?? 0)
      )
    }, 0)

    return {
      name: task.name,
      description: task.description ? task.description.substring(0, 50) : "No Description",
      container: task.container.name,
      deadline: task.deadline,
      status: task.status === Status.COMPLETED ? "Completed" : "Not completed",
      numberAssigned: totalLogs,
      formAssigned: formAssigned,
      percentComplete,
      percentApproved,
      newCommentsCount,
      view: {
        taskId: task.id,
        projectId: task.projectId,
      },
      comments: task.taskLogs?.[0]?.comments ?? [],
      refetchTasks,
      firstLogId: task.taskLogs?.[0]?.id,
    }
  })
}
