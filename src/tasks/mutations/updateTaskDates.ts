import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateTaskDatesSchema } from "../schemas"

import { requireManagerOf } from "src/projectprivileges/utils/requireAccess"
export default resolver.pipe(
  resolver.zod(UpdateTaskDatesSchema),
  resolver.authorize(),
  async ({ id, ...data }, ctx) => {
    await requireManagerOf(ctx, "task", [id])
    const task = await db.task.update({
      where: { id },
      data,
    })

    return task
  }
)
