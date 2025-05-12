import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateTasksForMilestoneSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateTasksForMilestoneSchema),
  resolver.authorize(),
  async ({ milestoneId, taskIds }) => {
    const updatedTasks = await db.$transaction(async (prisma) => {
      // Disassociate tasks that are not in the taskIds array
      await prisma.task.updateMany({
        where: {
          milestoneId,
          id: { notIn: taskIds },
        },
        data: { milestoneId: null },
      })

      // Associate the specified tasks with the milestone
      await prisma.task.updateMany({
        where: { id: { in: taskIds } },
        data: { milestoneId },
      })

      // Fetch and return the updated tasks
      return prisma.task.findMany({
        where: { id: { in: taskIds } },
      })
    })

    return updatedTasks
  }
)
