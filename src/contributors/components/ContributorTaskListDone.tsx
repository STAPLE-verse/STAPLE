import { useQuery } from "@blitzjs/rpc"
import Table from "src/core/components/Table"
import getTasks from "src/tasks/queries/getTasks"
import { MemberPrivileges, ProjectMember, Task, TaskLog } from "db"
import { FinishedTasksColumns } from "src/tasks/tables/columns/FinishedTasksColumns"
import { processFinishedTasks } from "src/tasks/tables/processing/processFinishedTasks"
import Card from "src/core/components/Card"
import Link from "next/link"
import { Routes } from "@blitzjs/next"

type TaskWithLogs = Task & {
  taskLogs: TaskLog[]
  assignedMembers: ProjectMember[]
}

interface ContributorTaskListDoneProps {
  contributorId: number
  projectId: number
  privilege: MemberPrivileges
}

export const ContributorTaskListDone = ({
  contributorId,
  projectId,
  privilege,
}: ContributorTaskListDoneProps) => {
  const [{ tasks }] = useQuery(getTasks, {
    where: {
      assignedMembers: {
        some: {
          id: contributorId, // Filter tasks assigned to this specific project member
        },
      },
    },
    include: {
      taskLogs: {
        where: {
          assignedToId: contributorId, // Ensure task logs are only for this project member
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
    <Card
      title={"Contributor Tasks"}
      tooltipContent="Only completed tasks are included"
      actions={
        privilege === MemberPrivileges.PROJECT_MANAGER && (
          <Link className="btn btn-primary" href={Routes.RolesPage({ projectId: projectId! })}>
            Edit Roles
          </Link>
        )
      }
    >
      <Table columns={FinishedTasksColumns} data={processedTasks} addPagination={true} />
    </Card>
  )
}
