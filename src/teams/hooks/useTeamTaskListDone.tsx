// @ts-nocheck

import { useQuery } from "@blitzjs/rpc"
import getTasks from "src/tasks/queries/getTasks"
import getUsers from "src/users/queries/getUsers"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { createColumnHelper } from "@tanstack/react-table"

// Define the type for the table data
type TaskTableData = {
  id: number
  completedBy: string
  taskName: string
  labels: string | JSX.Element
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
      labels: true,
    },
    orderBy: { id: "asc" },
  })

  // Filter completed tasks
  const completedTasks = tasks
    .map((task) => ({
      ...task,
      assignees: task.assignees.filter(
        (assignee) =>
          assignee.statusLogs.length > 0 && assignee.statusLogs[0].status === "COMPLETED"
      ),
    }))
    .filter((task) => task.assignees.length > 0)

  // Get usernames
  // Collect all unique contributor IDs from tasks
  const contributorIds = completedTasks.flatMap((task) =>
    task.assignees.flatMap((assignee) =>
      // Only use the latest change in statusLogs
      assignee.statusLogs[0].completedBy !== null ? assignee.statusLogs[0].completedBy : []
    )
  )

  // Fetch all users based on contributor IDs
  const [users] = useQuery(getUsers, {
    where: {
      contributions: {
        some: {
          id: { in: contributorIds },
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
    user.contributions.forEach((contribution) => {
      const { firstName, lastName, username } = user
      const fullName = firstName && lastName ? `${firstName} ${lastName}` : username
      userMap[contribution.id] = fullName
    })
  })

  // Transform tasks into the desired table format
  const tableData: TaskTableData[] = completedTasks.flatMap((task) =>
    task.assignees.map((assignee) => {
      return {
        id: task.id,
        // Completed by username
        completedBy: userMap[assignee.statusLogs[0].completedBy] || "Unknown",
        // Task name
        taskName: task.name,
        // Labels
        labels:
          task.labels.length > 0
            ? task.labels.map((label) => label.name).join(", ")
            : "No labels assigned",
        // Date
        completedAt:
          assignee.statusLogs[0].createdAt?.toLocaleDateString(undefined, {
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
    columnHelper.accessor("labels", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Labels",
      id: "labels",
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
