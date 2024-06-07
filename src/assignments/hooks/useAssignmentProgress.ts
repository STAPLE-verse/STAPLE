import { ExtendedTask } from "src/tasks/components/TaskContext"
import { ExtendedAssignment } from "./useAssignmentData"

export default function useAssignmentProgress(task: ExtendedTask) {
  // Get assignments
  const assignments: ExtendedAssignment[] = task.assignees

  // Filter and count statuses
  let notCompletedAssignmentsCount = 0
  let completedAssignmentsCount = 0

  assignments.forEach((assignment) => {
    if (assignment.statusLogs && assignment.statusLogs.length > 0) {
      // Take the latest status log only
      const latestStatus = assignment.statusLogs.reduce((latest, current) => {
        return latest.changedAt > current.changedAt ? latest : current
      })

      if (latestStatus.status === "NOT_COMPLETED") {
        notCompletedAssignmentsCount += 1
      } else if (latestStatus.status === "COMPLETED") {
        completedAssignmentsCount += 1
      }
    } else {
      // If there are no status logs, assume the assignment is not completed
      notCompletedAssignmentsCount += 1
    }
  })

  return { all: assignments.length, completed: completedAssignmentsCount }
}
