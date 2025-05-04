import { getContributorName } from "src/core/utils/getName"
import { TaskLogWithTaskCompleted } from "src/core/types"

export type TeamTaskListData = {
  id: number
  completedBy: string
  taskName: string
  roles: string | JSX.Element
  latestUpdate: string
  taskId: number
  projectId: number
  deadline: Date | null
  approved: Boolean | null
}

// Adjusted processor function for team task list
export function processTeamTaskList(
  taskLogs: TaskLogWithTaskCompleted[],
  locale: string
): TeamTaskListData[] {
  const userMap: { [key: number]: string } = {}

  // Populate user map for quick contributor name lookup
  taskLogs.forEach((taskLog) => {
    if (taskLog.completedBy) {
      const contributorName = getContributorName(taskLog.completedBy)
      if (contributorName) {
        userMap[taskLog.completedBy.id] = contributorName
      }
    }
  })

  // Transform tasks into the desired table format
  return taskLogs.map((taskLog) => {
    const task = taskLog.task
    console.log("Processing taskLog:", taskLog)
    return {
      id: task.id,
      completedBy: userMap[taskLog.completedBy?.id] || "Not Completed",
      taskName: task.name,
      roles: task.roles?.length
        ? task.roles.map((role) => role.name).join(", ")
        : "No roles assigned",
      latestUpdate:
        taskLog.createdAt?.toLocaleDateString(locale, {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }) || "Unknown",
      taskId: task.id,
      projectId: task.projectId,
      deadline: task.deadline,
      approved: taskLog.approved,
    }
  })
}
