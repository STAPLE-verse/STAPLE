import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateTaskOrderSchema } from "../schemas"

import { requireManagerOf } from "src/projectprivileges/utils/requireAccess"
export default resolver.pipe(
  resolver.zod(UpdateTaskOrderSchema),
  resolver.authorize(),
  async ({ tasks }, ctx) => {
    await requireManagerOf(
      ctx,
      "task",
      tasks.map((task) => task.taskId)
    )
    await requireManagerOf(
      ctx,
      "column",
      tasks.map((task) => task.containerId)
    )
    return await Promise.all(
      tasks.map(async (task) => {
        const updatedTask = await db.task.update({
          where: { id: task.taskId },
          data: {
            containerId: task.containerId,
            containerTaskOrder: task.containerTaskOrder,
          },
        })
        return updatedTask
      })
    )
  }
)
