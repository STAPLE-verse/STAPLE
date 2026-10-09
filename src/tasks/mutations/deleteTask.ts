import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteTaskSchema } from "../schemas"

import { requireManagerOf } from "src/projectprivileges/utils/requireAccess"
export default resolver.pipe(
  resolver.zod(DeleteTaskSchema),
  resolver.authorize(),
  async ({ id }, ctx) => {
    await requireManagerOf(ctx, "task", [id])
    // Delete assignments if the parent task is deleted
    await db.taskLog.deleteMany({ where: { taskId: id } })
    // Delete the task from the task table
    const task = await db.task.deleteMany({ where: { id } })

    return task
  }
)
