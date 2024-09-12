import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateColumnOrderSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateColumnOrderSchema),
  resolver.authorize(),
  async ({ containerIds }) => {
    // Perform updates within a transaction
    const updatedColumns = await db.$transaction(async (prisma) => {
      const updates = containerIds.map((containerId, index) => {
        return prisma.kanbanBoard.update({
          where: {
            id: containerId,
          },
          data: {
            containerOrder: index,
          },
        })
      })

      return await Promise.all(updates)
    })

    return updatedColumns
  }
)
