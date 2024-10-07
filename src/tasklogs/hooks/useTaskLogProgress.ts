import { ProjectMemberWithTaskLog } from "src/tasks/components/TaskContext"
import { filterLatestTaskLog } from "../utils/filterLatestTaskLog"

export default function useTaskLogProgress(projectMembers: ProjectMemberWithTaskLog[]) {
  // Filter and count statuses
  let notCompletedAssignmentsCount = 0
  let completedAssignmentsCount = 0

  projectMembers.forEach((projectMember) => {
    const taskLogs = projectMember.taskLogAssignedTo
    if (taskLogs && taskLogs.length > 0) {
      // Take the latest status log only
      const latestTaskLog = filterLatestTaskLog(taskLogs)

      if (latestTaskLog!.status === "NOT_COMPLETED") {
        notCompletedAssignmentsCount += 1
      } else if (latestTaskLog!.status === "COMPLETED") {
        completedAssignmentsCount += 1
      }
    } else {
      // If there are no status logs, assume the assignment is not completed
      notCompletedAssignmentsCount += 1
    }
  })

  return { all: projectMembers.length, completed: completedAssignmentsCount }
}
