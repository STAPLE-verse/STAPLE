import { Ctx } from "blitz"
import getTaskLogs from "../queries/getTaskLogs"

// taskLogService.ts (for example)
export const getLatestTaskLog = async (userId: number, ctx: Ctx) => {
  const taskLogs = await getTaskLogs(
    {
      where: {
        assignedTo: {
          users: { some: { id: userId } },
        },
      },
      include: { task: true },
    },
    ctx
  )

  const latestTaskLogs = taskLogs.reduce((acc, log) => {
    const existingLog = acc[log.taskId]

    if (!existingLog || new Date(log.createdAt) > new Date(existingLog.createdAt)) {
      acc[log.taskId] = log
    }

    return acc
  }, {})

  return Object.values(latestTaskLogs) // Convert object to array if needed
}
