import { useQuery } from "@blitzjs/rpc"
import getTaskLogs from "src/tasklogs/queries/getTaskLogs"
import Table from "src/core/components/Table"
import { useTaskContext } from "./TaskContext"
import { taskLogColumns } from "../tables/columns/TaskLogColumns"
import { Prisma } from "db"
import { useCurrentContributor } from "src/contributors/hooks/useCurrentContributor"

export type TaskLogwithComments = Prisma.TaskLogGetPayload<{
  include: {
    comments: {
      include: {
        commentReadStatus: true
        author: {
          include: {
            users: true
          }
        }
      }
    }
    assignedTo: true
    completedBy: true
    task: true
  }
}> & {
  firstLogId?: number
  overdue: boolean
  newCommentsCount: number
  projectId: number
  taskName: string
  statusText: string
  refetch: () => void
}

export const TaskLogTable = () => {
  const { task } = useTaskContext()
  const { projectMember: currentContributor } = useCurrentContributor(task.projectId)
  const [taskLogs, { refetch: refetchTaskLogs }] = useQuery(getTaskLogs, {
    where: { taskId: task.id },
    include: {
      comments: {
        include: {
          commentReadStatus: true,
          author: {
            include: {
              users: true,
            },
          },
        },
      },
      assignedTo: {
        include: {
          users: true,
        },
      },
      completedBy: true,
      task: true,
    },
  })

  // Group logs by assignedToId
  const groupedLogs = taskLogs.reduce((acc, log) => {
    const key = log.assignedToId
    if (!acc[key]) acc[key] = []
    acc[key].push(log as TaskLogwithComments)
    return acc
  }, {} as Record<number, TaskLogwithComments[]>)

  // Enrich logs per group
  const enrichedLogs: TaskLogwithComments[] = Object.values(groupedLogs).map((logs) => {
    const sorted = [...logs].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ) as TaskLogwithComments[]
    const latest = sorted[0]!
    const firstLogId = sorted[sorted.length - 1]?.id
    const overdue = task.deadline ? new Date(latest!.createdAt) > new Date(task.deadline) : false
    const newCommentsCount = latest!.comments.filter((comment) =>
      comment.commentReadStatus?.some(
        (status) => status.read === false && status.projectMemberId === currentContributor!.id
      )
    ).length
    return {
      ...latest,
      statusText: latest.status === "NOT_COMPLETED" ? "Not Completed" : "Completed",
      firstLogId,
      overdue,
      newCommentsCount,
      projectId: task.projectId,
      taskName: task.name,
      refetch: refetchTaskLogs,
    }
  })

  return (
    <div className="rounded-b-box rounded-tr-box bg-base-300 p-4">
      <div className="overflow-x-auto">
        <Table columns={taskLogColumns} data={enrichedLogs} addPagination={true} />
      </div>
    </div>
  )
}
