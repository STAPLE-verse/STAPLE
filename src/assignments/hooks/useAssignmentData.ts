import { Assignment, AssignmentStatusLog, Contributor, Team, User } from "db"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getContributor from "src/contributors/queries/getContributor"
import { useQuery } from "@blitzjs/rpc"
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

  // Get currentContributor
  const currentUser = useCurrentUser()
  // TODO: Replace by hook
  const [currentContributor] = useQuery(getContributor, {
    where: { projectId: task.projectId, userId: currentUser!.id },
  })

  // Filter out individual assignments
  const individualAssignments = assignments.filter(
    (assignment) =>
      assignment.contributorId !== null && assignment.contributorId == currentContributor.id
  )

  // Filter out team assignments
  const teamAssignments = assignments.filter((assignment) => {
    return (
      assignment.teamId !== null &&
      assignment.team?.contributors?.some((contributor) => contributor.id === currentContributor.id)
    )
  })

  return {
    individualAssignments,
    teamAssignments,
  }
}
