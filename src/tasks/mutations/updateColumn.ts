import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateColumnSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateColumnSchema),
  resolver.authorize(),
  async ({ id, name }) => {
    const updated = await db.kanbanBoard.update({
      where: { id: id },
      data: { name },
    })
    return updated
  }
)
