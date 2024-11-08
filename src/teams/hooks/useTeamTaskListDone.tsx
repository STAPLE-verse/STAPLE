import { useQuery } from "@blitzjs/rpc"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getTaskLogs from "src/tasklogs/queries/getTaskLogs"
import getLatestTaskLogs from "src/tasklogs/hooks/getLatestTaskLogs"
import { Role, Status, Task, TaskLog } from "db"
import { ProjectMemberWithUsers } from "src/pages/projects/[projectId]/teams"
import { processTeamTaskListDone } from "../tables/processing/processTeamTaskListDone"

type TaskWithRoles = Task & {
  roles: Role[] // Assuming roles is an array of Role
}

type TaskLogWithTask = TaskLog & {
  task: TaskWithRoles // This should already exist in your current setup
}

// Define the TaskLogWithTaskCompleted type
export type TaskLogWithTaskCompleted = TaskLogWithTask & {
  completedBy: ProjectMemberWithUsers // Ensure this is included
}

// Custom Hook
export const useTeamTaskListDone = (teamId: number) => {
  // Get table data for tasks assigned to the team
  const [taskLogs] = useQuery(getTaskLogs, {
    where: {
      assignedToId: teamId,
      status: Status.COMPLETED,
    },
    include: {
      task: {
        include: {
          roles: true, // Include roles associated with the task
        },
      },
      completedBy: {
        include: {
          users: true, // Include user details of the projectMember who completed the task
        },
      },
    },
  })

  // Filter to get only the latest task logs
  let latestTaskLogs: TaskLogWithTaskCompleted[] = []
  if (taskLogs) {
    latestTaskLogs = (getLatestTaskLogs(taskLogs) as TaskLogWithTaskCompleted[]) || []
  }

  const currentUser = useCurrentUser()
  const locale = currentUser ? currentUser.language : "en-US"

  const teamTaskListDoneData = processTeamTaskListDone(latestTaskLogs, locale)

  return { teamTaskListDoneData }
}
