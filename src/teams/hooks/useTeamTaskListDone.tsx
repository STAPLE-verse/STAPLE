import { useQuery } from "@blitzjs/rpc"
import getTasks from "src/tasks/queries/getTasks"
import getUsers from "src/users/queries/getUsers"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { createColumnHelper } from "@tanstack/react-table"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getTaskLogs from "src/tasklogs/queries/getTaskLogs"
import getLatestTaskLogs from "src/tasklogs/hooks/getLatestTaskLogs"
import getProjectMember from "src/projectmembers/queries/getProjectMember"
import { ProjectMemberWithUsers } from "src/pages/projects/[projectId]/teams"
import { ProjectMember, Task, TaskLog } from "db"

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

type TaskLogWithTaskCompleted = TaskLog & {
  task: Task
  completedBy: ProjectMember
}

// Custom Hook
export const useTeamTaskListDone = (teamId: number) => {
  // Get table data

  // tasks for this team set
  const [taskLogs] = useQuery(getTaskLogs, {
    where: {
      assignedToId: teamId,
    },
    include: {
      task: true,
      completedBy: true,
    },
  })
  // only the latest task log
  const allTaskLogs = getLatestTaskLogs(taskLogs) as TaskLogWithTaskCompleted[]

  // get user information based on teamId
  const [projectMember] = useQuery(getProjectMember, {
    where: {
      id: teamId,
    },
    include: {
      users: true,
    },
  }) as ProjectMemberWithUsers[]
  const userIds = projectMember?.users.map((user) => user.id) || []
  // Fetch all users based on projectMember IDs
  const [users] = useQuery(getUsers, {
    where: {
      id: { in: userIds }, // Filter users based on extracted IDs
    },
    include: {
      roles: true,
    },
  })

  // Create a user map for quick lookup and format the name
  const userMap: { [key: number]: string } = {}
  users.forEach((user) => {
    user["roles"].forEach((role) => {
      const { firstName, lastName, username } = user
      const fullName = firstName && lastName ? `${firstName} ${lastName}` : username
      userMap[role.id] = fullName
    })
  })

  const currentUser = useCurrentUser()
  const locale = currentUser ? currentUser.language : "en-US"

  // Transform tasks into the desired table format
  const tableData: TaskTableData[] = allTaskLogs.flatMap((taskLog) => {
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
          className="btn btn-primary"
          href={Routes.ShowTaskPage({
            projectId: info.row.original.projectId,
            taskId: info.getValue(),
          })}
        >
          View
        </Link>
      ),
    }),
  ]

  return { data: tableData, columns }
}
