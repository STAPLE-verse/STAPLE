import { useQuery } from "@blitzjs/rpc"
import Table from "src/core/components/Table"
import getTaskLogs from "src/tasklogs/queries/getTaskLogs"
import { MemberPrivileges, Status } from "db"
import getLatestTaskLogs from "src/tasklogs/hooks/getLatestTaskLogs"
import { TaskLogWithTaskCompleted } from "src/core/types"

interface ProjectMemberTaskListDoneProps {
  projectMemberId: number // ID of the ProjectMember, whether a team or individual contributor
  tableColumns: any
  dataProcessor: (taskLogs: TaskLogWithTaskCompleted[]) => any[]
}

const ProjectMemberTaskListDone = ({
  projectMemberId,
  tableColumns,
  dataProcessor,
}: ProjectMemberTaskListDoneProps) => {
  const [fetchedTaskLogs] = useQuery(getTaskLogs, {
    where: {
      assignedToId: projectMemberId,
      status: Status.COMPLETED,
    },
    include: {
      task: {
        include: {
          roles: true,
        },
      },
      completedBy: {
        include: {
          users: true,
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

  return <Table columns={tableColumns} data={processedTasks} addPagination={true} />
}

export default ProjectMemberTaskListDone
