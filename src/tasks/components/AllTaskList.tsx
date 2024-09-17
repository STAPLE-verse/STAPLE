import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { useQuery } from "@blitzjs/rpc"
import getTasks from "../queries/getTasks"
import Table from "src/core/components/Table"
import { allTasksTableColumns } from "./TaskTable"
import { processAllTasks } from "../utils/processTasks"

import getTaskLogs from "src/tasklogs/queries/getTaskLogs"

export const AllTasksList = () => {
  const currentUser = useCurrentUser()

  const [taskLogs] = useQuery(getTaskLogs, {
    where: {
      assignedTo: {
        users: { some: { id: currentUser?.id } },
      },
    },
    include: {
      task: true,
    },

    orderBy: { id: "asc" },
  })

  //console.log(taskLogs)

  const processedTasks = processAllTasks(taskLogs)

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">All Tasks</h1>
      <div>
        <Table columns={allTasksTableColumns} data={processedTasks} addPagination={true} />
      </div>
    </main>
  )
}
