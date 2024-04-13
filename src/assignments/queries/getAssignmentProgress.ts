import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetAssignmentProgress = z.object({
  taskId: z.number(),
})

export default resolver.pipe(
  resolver.zod(GetAssignmentProgress),
  resolver.authorize(),
  async ({ taskId }) => {
    // Get all the assignments for the given task
    const assignments = await db.assignment.findMany({
      where: { taskId },
      include: {
        statusLogs: {
          orderBy: {
            changedAt: "desc",
          },
          take: 1, // Take the latest status log only
        },
      },
    })

    // Filter and count statuses
    let notcompletedAssignmentsCount = 0
    let completedAssignmentsCount = 0

    assignments.forEach((assignment) => {
      const latestStatus = assignment.statusLogs[0]?.status
      if (latestStatus === "NOT_COMPLETED") {
        notcompletedAssignmentsCount += 1
      } else if (latestStatus === "COMPLETED") {
        completedAssignmentsCount += 1
      }
    })

    return { all: assignments.length, completed: completedAssignmentsCount }
  }
)
