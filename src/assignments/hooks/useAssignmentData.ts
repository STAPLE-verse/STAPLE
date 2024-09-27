import { Assignment, AssignmentStatusLog, Contributor, Team, User } from "db"
import { ExtendedTask } from "src/tasks/components/TaskContext"

// Creating custom types
// Extend Contributor to include User with only username
export type ExtendedContributor = Contributor & {
  user: Pick<User, "username">
}

export type ExtendedTeam = Team & {
  contributors: ExtendedContributor[]
}

export type ExtendedAssignmentStatusLog = AssignmentStatusLog & {
  contributor?: ExtendedContributor | null
}

export type ExtendedAssignment = Assignment & {
  contributor?: ExtendedContributor | null
  team?: ExtendedTeam | null
  statusLogs?: ExtendedAssignmentStatusLog[]
}

type useAssignmentDataType = {
  individualAssignments: ExtendedAssignment[]
  teamAssignments: ExtendedAssignment[]
}

// Hook to get assignment data from task returned by taskContext
export default function useAssignmentData(task: ExtendedTask): useAssignmentDataType {
  // Get assignments
  const assignments = task.assignees

  // Filter out individual assignments
  const individualAssignments = assignments.filter(
    (assignment) => assignment.contributorId !== null
  )

  // Filter out team assignments
  const teamAssignments = assignments.filter((assignment) => assignment.teamId !== null)

  return {
    individualAssignments,
    teamAssignments,
  }
}
