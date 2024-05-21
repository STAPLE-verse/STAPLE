import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateColumnOrderSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateColumnOrderSchema),
  resolver.authorize(),
  async ({ columnIds }) => {
    // Perform updates within a transaction
    const updatedColumns = await db.$transaction(async (prisma) => {
      const updates = columnIds.map((columnId, index) => {
        return prisma.column.update({
          where: {
            id: columnId,
          },
          data: {
            columnIndex: index,
          },
        })
      })

      return await Promise.all(updates)
    })

    return updatedColumns
  }
)
