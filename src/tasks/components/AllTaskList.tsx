import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { useQuery } from "@blitzjs/rpc"
import getTasks from "../queries/getTasks"
import Table from "src/core/components/Table"
import { allTasksTableColumns } from "./TaskTable"
import { processAllTasks } from "../utils/processTasks"

export const AllTasksList = () => {
  const currentUser = useCurrentUser()

  const [{ tasks }] = useQuery(getTasks, {
    where: {
      // Only return tasks where user is assigned
      OR: [
        {
          assignees: {
            // Individual contributor
            some: { contributor: { user: { id: currentUser?.id } }, teamId: null },
          },
        },
        {
          assignees: {
            some: {
              // Contributor as part of a team
              team: { contributors: { some: { user: { id: currentUser?.id } } } },
              contributorId: null,
            },
          },
        },
      ],
    },
    include: {
      project: true,
      // Only return assignments of the user
      assignees: {
        where: {
          OR: [
            {
              contributor: { user: { id: currentUser?.id } }, // Individual contributor
            },
            {
              team: { contributors: { some: { user: { id: currentUser?.id } } } }, // Contributor as part of a team
            },
          ],
        },
        include: { statusLogs: { orderBy: { createdAt: "desc" } } },
      },
    },
    orderBy: { id: "asc" },
  })

  const processedTasks = processAllTasks(tasks)

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">All Tasks</h1>
      <div>
        <Table columns={allTasksTableColumns} data={processedTasks} addPagination={true} />
      </div>
    </main>
  )
}
