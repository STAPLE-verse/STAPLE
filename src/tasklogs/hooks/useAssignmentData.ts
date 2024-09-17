import { Assignment, AssignmentStatusLog, Contributor, Team, User } from "db"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getContributor from "src/projectmembers/queries/getContributor"
import { useQuery } from "@blitzjs/rpc"
import { ExtendedTask } from "src/tasks/components/TaskContext"

// Creating custom types
// Extend Contributor to include User with only username
export type ExtendedContributor = Contributor & {
  user: Pick<User, "username">
}

export type ExtendedTeam = Team & {
  projectMembers: ExtendedContributor[]
}

export type ExtendedAssignmentStatusLog = AssignmentStatusLog & {
  projectMember?: ExtendedContributor | null
}

export type ExtendedAssignment = Assignment & {
  projectMember?: ExtendedContributor | null
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
      assignment.projectMemberId !== null && assignment.projectMemberId == currentContributor.id
  )

  // Filter out team assignments
  const teamAssignments = assignments.filter((assignment) => {
    return (
      assignment.teamId !== null &&
      assignment.team?.projectMembers?.some(
        (projectMember) => projectMember.id === currentContributor.id
      )
    )
  })

  return {
    individualAssignments,
    teamAssignments,
  }
}
