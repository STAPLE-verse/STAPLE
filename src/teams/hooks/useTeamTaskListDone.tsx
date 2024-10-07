import { useQuery } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { createColumnHelper } from "@tanstack/react-table"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getTaskLogs from "src/tasklogs/queries/getTaskLogs"
import getLatestTaskLogs from "src/tasklogs/hooks/getLatestTaskLogs"
import { ProjectMember, Role, Task, TaskLog } from "db"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { ProjectMemberWithUsers } from "src/pages/projects/[projectId]/teams"

// Define the type for the table data
type TaskTableData = {
  id: number
  completedBy: string
  taskName: string
  roles: string | JSX.Element
  latestUpdate: string
  taskId: number
  projectId: number
}

type TaskWithRoles = Task & {
  roles: Role[] // Assuming roles is an array of Role
}

type TaskLogWithTask = TaskLog & {
  task: TaskWithRoles // This should already exist in your current setup
}

// Define the TaskLogWithTaskCompleted type
type TaskLogWithTaskCompleted = TaskLogWithTask & {
  completedBy: ProjectMemberWithUsers // Ensure this is included
}

// Custom Hook
export const useTeamTaskListDone = (teamId: number) => {
  // Get table data for tasks assigned to the team
  const taskLogs = useQuery(getTaskLogs, {
    where: {
      assignedToId: teamId,
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
  }) as (TaskLog & { completedBy: ProjectMemberWithUsers; task: TaskWithRoles })[] // Casting directly here

  // Filter to get only the latest task logs
  let latestTaskLogs: TaskLogWithTaskCompleted[] = []
  if (taskLogs) {
    latestTaskLogs = (getLatestTaskLogs(taskLogs) as TaskLogWithTaskCompleted[]) || []
  }

  // Create a user map for quick lookup and format the name
  const userMap: { [key: number]: string } = {}
  latestTaskLogs.forEach((taskLog) => {
    const { completedBy } = taskLog
    // If `completedBy` has users associated with it
    completedBy.users.forEach((user) => {
      const { id, firstName, lastName, username } = user
      const fullName = firstName && lastName ? `${firstName} ${lastName}` : username
      userMap[id] = fullName
    })
  })

  const currentUser = useCurrentUser()
  const locale = currentUser ? currentUser.language : "en-US"

  // Transform tasks into the desired table format
  const tableData: TaskTableData[] = latestTaskLogs.flatMap((taskLog) => {
    // Ensure taskLog.task is an array; if it's a single task, wrap it in an array
    const tasks = Array.isArray(taskLog.task) ? taskLog.task : [taskLog.task]

    return tasks.map((task) => {
      return {
        id: task.id,
        // Completed by username
        completedBy: userMap[taskLog.completedBy?.id] || "Not Completed", // Use completedBy directly
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

  // Define columns
  // TODO: Define proper type for completedTasks
  const columnHelper = createColumnHelper<TaskTableData>()

  const columns = [
    columnHelper.accessor("completedBy", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Completed By",
      id: "completedBy",
    }),
    columnHelper.accessor("taskName", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Task Name",
      id: "taskName",
    }),
    columnHelper.accessor("roles", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Roles",
      id: "roles",
    }),
    columnHelper.accessor("latestUpdate", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Latest Update",
      id: "lastestUpdate",
    }),
    columnHelper.accessor("taskId", {
      id: "view",
      header: "View",
      enableColumnFilter: false,
      enableSorting: false,
      cell: (info) => (
        <Link
          className="btn btn-ghost"
          href={Routes.ShowTaskPage({
            projectId: info.row.original.projectId,
            taskId: info.getValue(),
          })}
        >
          <MagnifyingGlassIcon width={25} className="stroke-primary" />
        </Link>
      ),
    }),
  ]

  return { data: tableData, columns }
}
