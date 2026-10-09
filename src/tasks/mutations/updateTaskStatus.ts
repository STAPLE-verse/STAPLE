import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateTaskStatusSchema } from "../schemas"

import { requireManagerOf } from "src/projectprivileges/utils/requireAccess"
export default resolver.pipe(
  resolver.zod(UpdateTaskStatusSchema),
  resolver.authorize(),
  async ({ id, status }, ctx) => {
    await requireManagerOf(ctx, "task", [id])
    const task = await db.task.update({ where: { id }, data: { status } })

    return task
  }
)
