import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateTaskLabelSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateTaskLabelSchema),
  resolver.authorize(),
  async ({ taskId, labelsId = [], ...data }) => {
    // //First unset labels
    let task1
    await db.$transaction(async (prisma) => {
      const task = await db.task.update({
        where: { id: taskId },
        data: {
          labels: {
            set: [],
          },
        },
      })

      task1 = db.task.update({
        where: { id: taskId },
        data: {
          labels: {
            connect: labelsId?.map((c) => ({ id: c })) || [],
          },
        },
      })
    })

    // return task
    return task1
  }
)
