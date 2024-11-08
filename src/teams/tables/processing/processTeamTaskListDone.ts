import { getContributorName } from "src/services/getName"
import { TaskLogWithTaskCompleted } from "src/teams/hooks/useTeamTaskListDone"

export type TeamTaskListDoneData = {
  id: number
  completedBy: string
  taskName: string
  roles: string | JSX.Element
  latestUpdate: string
  taskId: number
  projectId: number
}

export function processTeamTaskListDone(
  taskLogs: TaskLogWithTaskCompleted[],
  locale: string
): TeamTaskListDoneData[] {
  // Create a user map for quick lookup and format the name
  const userMap: { [key: number]: string } = {}
  taskLogs.forEach((taskLog) => {
    const { completedBy } = taskLog
    // If `completedBy` has users associated with it
    if (completedBy) {
      const contributorName = getContributorName(completedBy)
      if (contributorName) {
        userMap[completedBy.id] = contributorName
      }
    }
  })

  // Transform tasks into the desired table format
  return taskLogs.flatMap((taskLog) => {
    // Ensure taskLog.task is an array; if it's a single task, wrap it in an array
    const tasks = Array.isArray(taskLog.task) ? taskLog.task : [taskLog.task]

    return tasks.map((task) => {
      return {
        id: task.id,
        // Completed by contributor name
        completedBy: userMap[taskLog.completedBy?.id] || "Not Completed",
        // Task name
        taskName: task.name,
        // Roles
        roles:
          task.roles?.length > 0
            ? task.roles.map((role) => role.name).join(", ")
            : "No roles assigned",
        // Date
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
        // View
        taskId: task.id,
        projectId: task.projectId,
      }
    })
  })
}
