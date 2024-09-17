import { useQuery } from "@blitzjs/rpc"
import getTasks from "src/tasks/queries/getTasks"
import getUsers from "src/users/queries/getUsers"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { createColumnHelper } from "@tanstack/react-table"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

// Define the type for the table data
type TaskTableData = {
  id: number
  completedBy: string
  taskName: string
  roles: string | JSX.Element
  completedAt: string
  taskId: number
  projectId: number
}

// Custom Hook
export const useTeamTaskListDone = (teamId: number) => {
  // Get table data
  // Fetch tasks
  const [{ tasks }] = useQuery(getTasks, {
    where: {
      assignees: {
        some: { teamId },
      },
    },
    include: {
      assignees: {
        include: {
          statusLogs: { orderBy: { createdAt: "desc" } },
        },
      },
      project: true,
      roles: true,
    },
    orderBy: { id: "asc" },
  })

  // Filter completed tasks
  const completedTasks = tasks
    .map((task) => ({
      ...task,
      assignees: task["assignees"].filter(
        (assignee) =>
          assignee.statusLogs.length > 0 && assignee.statusLogs[0].status === "COMPLETED"
      ),
    }))
    .filter((task) => task.assignees.length > 0)

  // Get usernames
  // Collect all unique projectMember IDs from tasks
  const projectMemberIds = completedTasks.flatMap((task) =>
    task.assignees.flatMap((assignee) =>
      // Only use the latest change in statusLogs
      assignee.statusLogs[0].completedBy !== null ? assignee.statusLogs[0].completedBy : []
    )
  )

  // Fetch all users based on projectMember IDs
  const [users] = useQuery(getUsers, {
    where: {
      contributions: {
        some: {
          id: { in: projectMemberIds },
        },
      },
    },
    include: {
      contributions: true,
    },
  })

  // Create a user map for quick lookup and format the name
  const userMap: { [key: number]: string } = {}
  users.forEach((user) => {
    user["contributions"].forEach((contribution) => {
      const { firstName, lastName, username } = user
      const fullName = firstName && lastName ? `${firstName} ${lastName}` : username
      userMap[contribution.id] = fullName
    })
  })

  const currentUser = useCurrentUser()
  const locale = currentUser ? currentUser.language : "en-US"

  // Transform tasks into the desired table format
  const tableData: TaskTableData[] = completedTasks.flatMap((task) =>
    task.assignees.map((assignee) => {
      return {
        id: task.id,
        // Completed by username
        completedBy: userMap[assignee.statusLogs[0].completedBy] || "Unknown",
        // Task name
        taskName: task.name,
        // Roles
        roles:
          task["roles"].length > 0
            ? task["roles"].map((role) => role.name).join(", ")
            : "No roles assigned",
        // Date
        completedAt:
          assignee.statusLogs[0].createdAt?.toLocaleDateString(locale, {
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
  )

  // Define columns
  // TODO: Define proper type for completedTasks
  const columnHelper = createColumnHelper<TaskTableData>()

  const columns = [
    columnHelper.accessor("completedBy", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Completed by",
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
    columnHelper.accessor("completedAt", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Completed at",
      id: "completedAt",
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
