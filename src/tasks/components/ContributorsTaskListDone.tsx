// @ts-nocheck

import { useQuery } from "@blitzjs/rpc"
import Table from "src/core/components/Table"
import getTasks from "src/tasks/queries/getTasks"

export const ContributorTaskListDone = ({ contributor, columns }) => {
  const [{ tasks }] = useQuery(getTasks, {
    where: {
      OR: [
        { assignees: { some: { contributorId: contributor.id } } },
        { assignees: { some: { team: { contributors: { some: { id: contributor.id } } } } } },
      ],
    },
    include: {
      assignees: {
        include: { statusLogs: { orderBy: { createdAt: "desc" } } },
      },
      project: true,
      labels: true,
    },
    orderBy: { id: "asc" },
  })

  const completedTasks = tasks
    .map((task) => ({
      ...task,
      assignees: task.assignees.filter(
        (assignee) =>
          assignee.statusLogs.length > 0 && assignee.statusLogs[0].status === "COMPLETED"
      ),
    }))
    .filter((task) => task.assignees.length > 0)

  return (
    <div>
      <Table columns={columns} data={completedTasks} />
    </div>
  )
}