import { Prisma } from "db"
import { getProjectMemberName } from "src/services/getName"
import { ExtendedTask } from "src/tasks/components/TaskContext"
import { getUniqueProjectMembers } from "src/tasks/utils/getUniqueProjectMembers"

export type ProcessedMetadata = {
  completedBy: string
  createdAt: string
  [key: string]: any
}

export function processMetadata(task: ExtendedTask): ProcessedMetadata[] {
  // Get unique project members for the task
  const taskProjectMembers = getUniqueProjectMembers(task)

  // Filter completed statusLogs
  const statusLogs = task.assignees.flatMap((assignment) => assignment.statusLogs ?? [])

  const completedStatusLogs = statusLogs.filter(
    (statusLog): statusLog is NonNullable<typeof statusLog> & { metadata: Prisma.JsonObject } => {
      return (
        statusLog?.status === "COMPLETED" &&
        statusLog.metadata !== null &&
        typeof statusLog.metadata === "object" &&
        !Array.isArray(statusLog.metadata)
      )
    }
  )

  const tableData = completedStatusLogs.flatMap((statusLog) => {
    const projectmember = taskProjectMembers.find(
      (projectmember) => projectmember.id === statusLog.completedBy
    )
    return {
      completedBy: getProjectMemberName(projectmember),
      createdAt: statusLog.createdAt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
      ...(statusLog.metadata as Prisma.JsonObject),
    }
  })

  return tableData
}
