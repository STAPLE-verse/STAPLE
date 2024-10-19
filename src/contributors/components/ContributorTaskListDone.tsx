import { useQuery } from "@blitzjs/rpc"
import Table from "src/core/components/Table"
import getTasks from "src/tasks/queries/getTasks"
import { ProjectMember, Task, TaskLog } from "db"
import { processFinishedTasks } from "src/tasks/utils/processTasks"
import { finishedTasksTableColumns } from "src/tasks/components/TaskTable"

type TaskWithLogs = Task & {
  taskLogs: TaskLog[]
  assignedMembers: ProjectMember[]
}

export const ContributorTaskListDone = ({ contributor }) => {
  const [{ tasks }] = useQuery(getTasks, {
    where: {
      assignedMembers: {
        some: {
          id: contributor.id, // Filter tasks assigned to this specific project member
        },
      },
    },
    include: {
      taskLogs: {
        where: {
          assignedToId: contributor.id, // Ensure task logs are only for this project member
        },
        orderBy: { createdAt: "desc" }, // Order by createdAt, descending
      },
      assignedMembers: {
        include: {
          users: true, // Include user details for each assigned project member
        },
      },
      project: true, // Include project details if needed
      roles: true, // Include roles details if needed
    },
    orderBy: { id: "asc" }, // Order tasks by ID
  }) as unknown as [{ tasks: TaskWithLogs[] }]

  const completedTasks = tasks.filter((task) => {
    const latestLog = task.taskLogs[0] // Since logs are ordered by createdAt desc, the first one is the latest
    return latestLog && latestLog.status === "COMPLETED"
  })

  const processedTasks = processFinishedTasks(completedTasks)

  return (
    <div>
      <Table columns={finishedTasksTableColumns} data={processedTasks} addPagination={true} />
    </div>
  )
}
