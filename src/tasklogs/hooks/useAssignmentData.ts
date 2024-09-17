import { Assignment, AssignmentStatusLog, ProjectMember, Team, User } from "db"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getProjectMember from "src/projectmembers/queries/getProjectMember"
import { useQuery } from "@blitzjs/rpc"
import { ExtendedTask } from "src/tasks/components/TaskContext"

// Creating custom types
// Extend ProjectMember to include User with only username
export type ExtendedProjectMember = ProjectMember & {
  user: Pick<User, "username">
}

export type ExtendedTeam = Team & {
  projectMembers: ExtendedProjectMember[]
}

export type ExtendedAssignmentStatusLog = AssignmentStatusLog & {
  projectMember?: ExtendedProjectMember | null
}

export type ExtendedAssignment = Assignment & {
  projectMember?: ExtendedProjectMember | null
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

  // Get currentProjectMember
  const currentUser = useCurrentUser()
  // TODO: Replace by hook
  const [currentProjectMember] = useQuery(getProjectMember, {
    where: { projectId: task.projectId, userId: currentUser!.id },
  })

  // Filter out individual assignments
  const individualAssignments = assignments.filter(
    (assignment) =>
      assignment.projectMemberId !== null && assignment.projectMemberId == currentProjectMember.id
  )

  // Filter out team assignments
  const teamAssignments = assignments.filter((assignment) => {
    return (
      assignment.teamId !== null &&
      assignment.team?.projectMembers?.some(
        (projectMember) => projectMember.id === currentProjectMember.id
      )
    )
  })

  return {
    individualAssignments,
    teamAssignments,
  }
}
