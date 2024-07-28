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

export type ExtendedAssignmentStatusLog = AssignmentStatusLog & {
  contributor?: ExtendedContributor | null
}
export type ExtendedAssignment = Assignment & {
  contributor?: Contributor | null
  team?: (Team & { contributors: Contributor[] }) | null
  statusLogs?: ExtendedAssignmentStatusLog[]
}

type useAssignmentDataType = {
  individualAssignments: ExtendedAssignment[]
  teamAssignments: ExtendedAssignment[]
}

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
