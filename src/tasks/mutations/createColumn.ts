import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateColumnSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateColumnSchema),
  resolver.authorize(),
  async ({ projectId, name }) => {
    const columnCount = await db.kanbanBoard.count({
      where: { projectId: projectId },
    })

    // Create a new column in the database
    const column = await db.kanbanBoard.create({
      data: {
        name: name,
        projectId: projectId,
        containerOrder: columnCount,
      },
    })

    return column
  }
)
