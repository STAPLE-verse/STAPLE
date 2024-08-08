import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateTasksForElementSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateTasksForElementSchema),
  resolver.authorize(),
  async ({ elementId, taskIds }) => {
    const updatedTasks = await db.$transaction(async (prisma) => {
      // Disassociate tasks that are not in the taskIds array
      await prisma.task.updateMany({
        where: {
          elementId,
          id: { notIn: taskIds },
        },
        data: { elementId: null },
      })

      // Associate the specified tasks with the element
      await prisma.task.updateMany({
        where: { id: { in: taskIds } },
        data: { elementId },
      })

      // Fetch and return the updated tasks
      return prisma.task.findMany({
        where: { id: { in: taskIds } },
      })
    })

    return updatedTasks
  }
)
