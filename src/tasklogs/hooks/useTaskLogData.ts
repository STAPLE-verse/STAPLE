import { TaskLog, ProjectMember, User } from "db"
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

export type ExtendedTaskLogStatusLog = TaskLogStatusLog & {
  projectMember?: ExtendedProjectMember | null
}

export type ExtendedTaskLog = TaskLog & {
  projectMember?: ExtendedProjectMember | null
  team?: ExtendedTeam | null
  statusLogs?: ExtendedTaskLogStatusLog[]
}

type useTaskLogDataType = {
  individualTaskLogs: ExtendedTaskLog[]
  teamTaskLogs: ExtendedTaskLog[]
}

// Hook to get assignment data from task returned by taskContext
export default function useTaskLogData(task: ExtendedTask): useTaskLogDataType {
  // Get assignments
  const assignments = task.assignees

  // Get currentProjectMember
  const currentUser = useCurrentUser()
  // TODO: Replace by hook
  const [currentProjectMember] = useQuery(getProjectMember, {
    where: { projectId: task.projectId, userId: currentUser!.id },
  })

  // Filter out individual assignments
  const individualTaskLogs = assignments.filter(
    (assignment) =>
      assignment.projectMemberId !== null && assignment.projectMemberId == currentProjectMember.id
  )

  // Filter out team assignments
  const teamTaskLogs = assignments.filter((assignment) => {
    return (
      assignment.teamId !== null &&
      assignment.team?.projectMembers?.some(
        (projectMember) => projectMember.id === currentProjectMember.id
      )
    )
  })

  return {
    individualTaskLogs,
    teamTaskLogs,
  }
}
