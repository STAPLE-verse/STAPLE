import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { useQuery } from "@blitzjs/rpc"
import getTaskLogs from "src/tasklogs/queries/getTaskLogs"
import getLatestTaskLogs from "src/tasklogs/hooks/getLatestTaskLogs"
import { processAllTasks } from "../tables/processing/processAllTasks"
import Table from "src/core/components/Table"
import { AllTasksColumns } from "../tables/columns/AllTasksColumns"
import { TaskLogWithTask } from "src/core/types"

export const AllTasksList = () => {
  const currentUser = useCurrentUser()

  // get latest logs that this user is involved in
  const [fetchedTaskLogs] = useQuery(getTaskLogs, {
    where: {
      assignedTo: {
        users: { some: { id: currentUser?.id } },
        deleted: false,
      },
    },
    include: {
      task: {
        include: {
          project: true, // Include the project linked to the task
        },
      },
    },
    orderBy: { id: "asc" },
  })

  // Cast and handle the possibility of `undefined`
  const taskLogs: TaskLogWithTask[] = (fetchedTaskLogs ?? []) as TaskLogWithTask[]

  // process those logs to get the latest one for each task-projectmemberId
  const latestLogs = getLatestTaskLogs<TaskLogWithTask>(taskLogs)

  const processedTasks = processAllTasks(latestLogs)

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">All Tasks</h1>
      <div>
        <Table columns={AllTasksColumns} data={processedTasks} addPagination={true} />
      </div>
    </main>
  )
}
