import { Prisma } from "db"
import { getContributorName } from "src/services/getName"
import { ExtendedTaskLog } from "src/tasklogs/hooks/useTaskLogData"
import { filterLatestTaskLog } from "src/tasklogs/utils/filterLatestTaskLog"

export type ProcessedMetadata = {
  completedBy: string
  createdAt: string
  [key: string]: any
}

export function processMetadata(projectMembers): ProcessedMetadata[] {
  const latestCompletedTaskLogs: ExtendedTaskLog[] = []
  // Iterate over each project member
  projectMembers.forEach((member) => {
    // Get the latest task log for this project member using the provided function
    const latestLog = filterLatestTaskLog(member.taskLogAssignedTo)

    // Check if the latest log exists and is completed
    if (latestLog && latestLog.status === "COMPLETED") {
      latestCompletedTaskLogs.push(latestLog)
    }
  })

  // Process metadata for each of the latest completed logs
  const tableData = latestCompletedTaskLogs.map((statusLog) => {
    // Find the project member who completed this task
    // const projectMember = projectMembers.find((member) => member.id === statusLog.completedById)

    return {
      completedBy: getContributorName(statusLog.completedBy), // Use getContributorName to get username
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
