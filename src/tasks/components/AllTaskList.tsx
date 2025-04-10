import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { useQuery } from "@blitzjs/rpc"
import getTaskLogs from "src/tasklogs/queries/getTaskLogs"
import getLatestTaskLogs from "src/tasklogs/hooks/getLatestTaskLogs"
import { processAllTasks } from "../tables/processing/processAllTasks"
import Table from "src/core/components/Table"
import { AllTasksColumns } from "../tables/columns/AllTasksColumns"
import { TaskLogWithTaskAndProject } from "src/core/types"
import Card from "src/core/components/Card"

export const AllTasksList = () => {
  const currentUser = useCurrentUser()

  // Get latest logs that this user is involved in
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
  const taskLogs: TaskLogWithTaskAndProject[] = (fetchedTaskLogs ??
    []) as TaskLogWithTaskAndProject[]

  // process those logs to get the latest one for each task-projectmemberId
  const latestLogs = getLatestTaskLogs<TaskLogWithTaskAndProject>(taskLogs)

  const processedTasks = processAllTasks(latestLogs)

  return (
    <Card title={""}>
      <Table columns={AllTasksColumns} data={processedTasks} addPagination={true} />
    </Card>
  )
}
