import { useQuery } from "@blitzjs/rpc"
import getTasks from "src/tasks/queries/getTasks"
import getUsers from "src/users/queries/getUsers"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { createColumnHelper } from "@tanstack/react-table"
import { Task } from "db"

// Custom Hook
export const useTeamTaskListDone = (teamId) => {
  // TODO: reformat the whole code to only provide well formatted data to the table! no unnecessary things!
  // Get table data
  // Get tasks
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

  // Get usernames
  // Collect all unique contributor IDs from tasks
  const contributorIds = tasks.flatMap((task) =>
    task.assignees.flatMap((assignee) =>
      assignee.statusLogs.map((statusLog) => statusLog.completedBy)
    )
  )

  // Use reduce to get unique contributor IDs and filter out null values
  const uniqueContributorIds = contributorIds.reduce((acc, id) => {
    if (id !== null && !acc.includes(id)) {
      acc.push(id)
    }
    return acc
  }, [])

  // Fetch all users based on contributor IDs
  const [users] = useQuery(getUsers, { where: { id: { in: uniqueContributorIds } } })

  // Create a user map for quick lookup and format the name
  const userMap = users.reduce((acc, user) => {
    const { firstName, lastName, username } = user
    const fullName = firstName && lastName ? `${firstName} ${lastName}` : username
    acc[user.id] = fullName
    return acc
  }, {})

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
    // Add username to completed tasks
    .map((task) => ({
      ...task,
      assignees: task.assignees.map((assignee) => ({
        ...assignee,
        completedByUser: userMap[assignee.statusLogs[0].completedBy],
      })),
    }))

  // Define columns
  // TODO: Define proper type for completedTasks
  const columnHelper = createColumnHelper<Task>()

  const columns = [
    columnHelper.accessor("assignees", {
      cell: (info) => {
        const assignee = info.getValue()[0]
        const username = assignee.completedByUser
        return <span>{username}</span>
      },
      header: "Completed by",
      id: "completedBy",
    }),
    columnHelper.accessor("name", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Task Name",
      id: "taskName",
    }),
    columnHelper.accessor("labels", {
      cell: (info) => {
        if (info.getValue().length > 0) {
          const temp = info.getValue().map((i) => i.name)
          return <span>{temp.join(", ")}</span>
        } else {
          return "No labels assigned to the task"
        }
      },
      header: "Labels",
      id: "label",
    }),
    columnHelper.accessor("assignees", {
      cell: (info) => {
        const temp = info.getValue()[0].statusLogs[0].createdAt?.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false, // Use 24-hour format
        })
        return <span>{temp}</span>
      },
      header: "Completed at",
      id: "completedAt",
    }),
    columnHelper.accessor("id", {
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

  return { data: completedTasks, columns }
}
