import { useQuery } from "@blitzjs/rpc"
import Table from "src/core/components/Table"
import getTaskLogs from "src/tasklogs/queries/getTaskLogs"
import Card from "src/core/components/Card"
import { MemberPrivileges, Status } from "db"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import getLatestTaskLogs from "src/tasklogs/hooks/getLatestTaskLogs"
import { TaskLogWithTaskCompleted } from "src/core/types"

interface ProjectMemberTaskListDoneProps {
  projectMemberId: number // ID of the ProjectMember, whether a team or individual contributor
  projectId: number
  privilege: MemberPrivileges
  tableColumns: any
  dataProcessor: (taskLogs: TaskLogWithTaskCompleted[]) => any[]
  title: string
  tooltipContent: string
}

const ProjectMemberTaskListDone = ({
  projectMemberId,
  projectId,
  privilege,
  tableColumns,
  dataProcessor,
  title,
  tooltipContent,
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

  return (
    <Card
      title={title}
      tooltipContent={tooltipContent}
      actions={
        privilege === MemberPrivileges.PROJECT_MANAGER && (
          <Link className="btn btn-primary" href={Routes.RolesPage({ projectId })}>
            Edit Roles
          </Link>
        )
      }
    >
      <Table columns={tableColumns} data={processedTasks} addPagination={true} />
    </Card>
  )
}

export default ProjectMemberTaskListDone
