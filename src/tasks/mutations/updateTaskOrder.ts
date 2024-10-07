import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateTaskOrderSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateTaskOrderSchema),
  resolver.authorize(),
  async ({ tasks }) => {
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
