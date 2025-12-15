import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { useQuery } from "@blitzjs/rpc"
import getTaskLogs from "src/tasklogs/queries/getTaskLogs"
import getLatestTaskLogs from "src/tasklogs/hooks/getLatestTaskLogs"
import { processAllTasks } from "../tables/processing/processAllTasks"
import Table from "src/core/components/Table"
import { AllTasksColumns } from "../tables/columns/AllTasksColumns"
import { TaskLogWithTaskProjectAndComments } from "src/core/types"
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
      comments: {
        include: {
          commentReadStatus: {
            where: {
              projectMember: {
                users: {
                  some: {
                    id: currentUser?.id,
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { id: "asc" },
  })

  // Cast and handle the possibility of `undefined`
  const taskLogs: TaskLogWithTaskProjectAndComments[] = (fetchedTaskLogs ??
    []) as TaskLogWithTaskProjectAndComments[]

  // process those logs to get the latest one for each task-projectmemberId
  const latestLogs = getLatestTaskLogs<TaskLogWithTaskProjectAndComments>(taskLogs)

  // process both sets so that comment counts use original taskLogs (first log for each person-task combo)
  const processedTasks = processAllTasks(latestLogs, taskLogs)

  return (
    <Card title="">
      <div className="overflow-y-auto">
        <Table columns={AllTasksColumns} data={processedTasks} addPagination={true} />
        <span className="italic">
          Note: This list only shows comment notifications for tasks that are explicitly assigned to
          you. If you are a project manager but not assigned to a task, you will not see its comment
          notifications here. Those comments will appear on the main dashboard and project task page
          instead.
        </span>
      </div>
    </Card>
  )
}
