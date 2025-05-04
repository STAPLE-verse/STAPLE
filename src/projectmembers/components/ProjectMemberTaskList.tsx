import { useQuery } from "@blitzjs/rpc"
import Table from "src/core/components/Table"
import getTaskLogs from "src/tasklogs/queries/getTaskLogs"
import getLatestTaskLogs from "src/tasklogs/hooks/getLatestTaskLogs"
import { TaskLogWithTaskCompleted } from "src/core/types"

interface ProjectMemberTaskListProps {
  projectMemberId: number // ID of the ProjectMember, whether a team or individual contributor
  tableColumns: any
  dataProcessor: (taskLogs: TaskLogWithTaskCompleted[]) => any[]
  currentUserId: number // Add currentUserId as a prop
}

const ProjectMemberTaskList = ({
  projectMemberId,
  tableColumns,
  dataProcessor,
}: ProjectMemberTaskListProps) => {
  const [fetchedTaskLogs] = useQuery(getTaskLogs, {
    where: {
      assignedToId: projectMemberId, // Use currentUserId here to filter tasks
    },
    orderBy: undefined,
    include: {
      task: {
        include: {
          roles: true, // Include roles related to task
        },
      },
      completedBy: {
        include: {
          users: true, // Include users related to completedBy
        },
      },
    },
  })

  const taskLogs: TaskLogWithTaskCompleted[] = fetchedTaskLogs
    ? (fetchedTaskLogs as TaskLogWithTaskCompleted[])
    : []

  // Get the latest task logs
  const latestTaskLogs = getLatestTaskLogs<TaskLogWithTaskCompleted>(taskLogs)

  const processedTasks = dataProcessor(latestTaskLogs)
  console.log(processedTasks)

  return <Table columns={tableColumns} data={processedTasks} addPagination={true} />
}

export default ProjectMemberTaskList
