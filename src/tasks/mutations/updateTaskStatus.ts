import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateTaskStatusSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateTaskStatusSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const task = await db.task.update({ where: { id }, data })

    return task
  }
)
