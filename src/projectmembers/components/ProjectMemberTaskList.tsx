import { useQuery } from "@blitzjs/rpc"
import getComments from "src/comments/queries/getComments"
import Table from "src/core/components/Table"
import { TaskLogTaskCompleted } from "src/core/types"
import getTaskLogs from "src/tasklogs/queries/getTaskLogs"
import { processTaskLogHistory } from "src/tasklogs/tables/processing/processTaskLogs"

interface ProjectMemberTaskListProps {
  projectMemberId: number // ID of the ProjectMember, whether a team or individual contributor
  tableColumns: any
  dataProcessor: "team" | "individual"
}

const ProjectMemberTaskList = ({ projectMemberId, tableColumns }: ProjectMemberTaskListProps) => {
  const [taskLogs] = useQuery(getTaskLogs, {
    where: { assignedToId: projectMemberId },
    include: {
      task: {
        include: {
          formVersion: true,
        },
      },
      completedBy: { include: { users: true } },
      assignedTo: { include: { users: true } },
    },
  })
  const [comments = [], { refetch: refetchComments }] = useQuery(getComments, {
    where: {
      taskLogId: {
        in: taskLogs.map((log) => log.id),
      },
    },
  })

  const processedData = processTaskLogHistory(
    taskLogs as TaskLogTaskCompleted[],
    comments,
    refetchComments
  )

  return <Table columns={tableColumns} data={processedData} addPagination={true} />
}

export default ProjectMemberTaskList
