import { Ctx } from "blitz"
import getTaskLogs from "../queries/getTaskLogs"
import { CompletedAs, Prisma, Status, Task } from "db"

type TaskLogWithTask = {
  id: number
  createdAt: Date
  status: Status
  metadata: Prisma.JsonValue | null
  completedAs: CompletedAs
  assignedToId: number
  completedById: number | null
  taskId: number
  task: Task // Ensure task is included here
}

export const getLatestTaskLog = async (userId: number): Promise<TaskLogWithTask[]> => {
  const taskLogs = await getTaskLogs({
    where: {
      assignedTo: {
        users: { some: { id: userId } },
      },
    },
    include: { task: true }, // Ensure task is included
  })

  const latestTaskLogs = taskLogs.reduce((acc, log) => {
    const existingLog = acc[log.taskId]

    if (!existingLog || new Date(log.createdAt) > new Date(existingLog.createdAt)) {
      acc[log.taskId] = log as TaskLogWithTask // Type assertion
    }

    return acc
  }, {} as Record<number, TaskLogWithTask>)

  return Object.values(latestTaskLogs)
}
