import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateTaskLabelSchema } from "../schemas"

async function updateTask(taskId, labelsId, disconnect) {
  let task1
  await db.$transaction(async (prisma) => {
    if (disconnect) {
      const task = await db.task.update({
        where: { id: taskId },
        data: {
          labels: {
            set: [],
          },
        },
      })
    }

    task1 = db.task.update({
      where: { id: taskId },
      data: {
        labels: {
          connect: labelsId?.map((c) => ({ id: c })) || [],
        },
      },
    })
  })
  return task1
}

export default resolver.pipe(
  resolver.zod(UpdateTaskLabelSchema),
  resolver.authorize(),
  async ({ tasksId, labelsId = [], disconnect, ...data }) => {
    let task1
    tasksId.forEach(async (taskId) => {
      task1 = await updateTask(taskId, labelsId, disconnect)
    })
    // await db.$transaction(async (prisma) => {
    //   const task = await db.task.update({
    //     where: { id: taskId },
    //     data: {
    //       labels: {
    //         set: [],
    //       },
    //     },
    //   })

    //   task1 = db.task.update({
    //     where: { id: taskId },
    //     data: {
    //       labels: {
    //         connect: labelsId?.map((c) => ({ id: c })) || [],
    //       },
    //     },
    //   })
    // })

    // return task
    return task1
  }
)
