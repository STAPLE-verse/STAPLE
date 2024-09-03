import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { useQuery } from "@blitzjs/rpc"
import getTasks from "../queries/getTasks"
import Table from "src/core/components/Table"
import { taskTableColumns } from "./TaskTable"

export const AllTasksList = () => {
  const currentUser = useCurrentUser()

  const [{ tasks }] = useQuery(getTasks, {
    where: {
      OR: [
        {
          assignees: {
            some: { contributor: { user: { id: { in: currentUser?.id } } }, teamId: null },
          },
        },
        {
          assignees: {
            some: {
              team: { contributors: { some: { id: { in: currentUser?.id } } } },
              contributorId: null,
            },
          },
        },
      ],
    },
    include: {
      project: true,
      assignees: { include: { statusLogs: { orderBy: { createdAt: "desc" } } } },
    },
    orderBy: { id: "asc" },
  })

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">All Tasks</h1>
      <div>
        <Table columns={taskTableColumns} data={tasks} addPagination={true} />
      </div>
    </main>
  )
}
