import { eventBus } from "src/core/utils/eventBus"
import { useEffect } from "react"
import { useQuery } from "@blitzjs/rpc"
import getComments from "src/comments/queries/getComments"
import CollapseCard from "src/core/components/CollapseCard"
import Table from "src/core/components/Table"
import { TaskLogTaskCompleted } from "src/core/types"
import getTaskLogs from "src/tasklogs/queries/getTaskLogs"
import { processTaskLogHistory } from "src/tasklogs/tables/processing/processTaskLogs"

interface ProjectMemberTaskListProps {
  projectMemberId: number // ID of the ProjectMember, whether a team or individual contributor
  tableColumns: any
  currentContributor: number
}

const ProjectMemberTaskList = ({
  projectMemberId,
  tableColumns,
  currentContributor,
}: ProjectMemberTaskListProps) => {
  const [taskLogs, { refetch: refetchTaskLogs }] = useQuery(getTaskLogs, {
    where: { assignedToId: projectMemberId },
    orderBy: { createdAt: "desc" },
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

  useEffect(() => {
    const handleTaskLogUpdate = () => {
      void refetchTaskLogs()
    }
    eventBus.on("taskLogUpdated", handleTaskLogUpdate)
    return () => eventBus.off("taskLogUpdated", handleTaskLogUpdate)
  }, [refetchTaskLogs])

  const processedData = processTaskLogHistory(
    taskLogs as TaskLogTaskCompleted[],
    comments,
    refetchComments,
    currentContributor,
    () => refetchTaskLogs()
  )

  return (
    <CollapseCard title="Contributor Tasks" className="mt-4">
      <Table columns={tableColumns} data={processedData} addPagination={true} />
    </CollapseCard>
  )
}

export default ProjectMemberTaskList
