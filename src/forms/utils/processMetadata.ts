import { Prisma } from "db"
import { getContributorName } from "src/services/getName"
import { ExtendedTask } from "src/tasks/components/TaskContext"
import { getUniqueContributors } from "src/tasks/utils/getUniqueContributors"

export type ProcessedMetadata = {
  completedBy: string
  createdAt: string
  [key: string]: any
}

export function processMetadata(task: ExtendedTask): ProcessedMetadata[] {
  // Get unique contributors for the task
  const taskContributors = getUniqueContributors(task)

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
    const contributor = taskContributors.find(
      (contributor) => contributor.id === statusLog.completedBy
    )
    return {
      completedBy: getContributorName(contributor),
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
