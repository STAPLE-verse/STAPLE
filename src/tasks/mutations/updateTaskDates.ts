import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateTaskDatesSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateTaskDatesSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    const task = await db.task.update({
      where: { id },
      data,
    })

    return task
  }
)
