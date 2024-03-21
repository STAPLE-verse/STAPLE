import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { z } from "zod"

const GetAssignmentProgress = z.object({
  taskId: z.number(),
})

export default resolver.pipe(
  resolver.zod(GetAssignmentProgress),
  resolver.authorize(),
  async ({ taskId }) => {
    const assignmentCounts = await db.assignment.groupBy({
      by: ["taskId", "status"],
      where: {
        taskId: taskId,
      },
      _count: {
        status: true,
      },
    })

    // Extract counts from the result
    const notcompletedAssignmentsCount = assignmentCounts
      .filter((count) => count.status === "NOT_COMPLETED")
      .reduce((sum, count) => sum + count._count.status, 0)

    const completedAssignmentsCount = assignmentCounts
      .filter((count) => count.status === "COMPLETED")
      .reduce((sum, count) => sum + count._count.status, 0)

    const allAssignmentsCount = notcompletedAssignmentsCount + completedAssignmentsCount

    return { all: allAssignmentsCount, completed: completedAssignmentsCount }
  }
)
