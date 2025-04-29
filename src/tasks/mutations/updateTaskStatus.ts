import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateTaskStatusSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateTaskStatusSchema),
  resolver.authorize(),
  async ({ id, status }) => {
    const task = await db.task.update({ where: { id }, data: { status } })

    return task
  }
)
