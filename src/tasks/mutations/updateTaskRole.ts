import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateTaskRoleSchema } from "../schemas"

async function updateTask(taskId, rolesId, disconnect) {
  let task1
  await db.$transaction(async (prisma) => {
    if (disconnect) {
      const task = await db.task.update({
        where: { id: taskId },
        data: {
          roles: {
            set: [],
          },
        },
      })
    }

    task1 = db.task.update({
      where: { id: taskId },
      data: {
        roles: {
          connect: rolesId?.map((c) => ({ id: c })) || [],
        },
      },
    })
  })
  return task1
}

export default resolver.pipe(
  resolver.zod(UpdateTaskRoleSchema),
  resolver.authorize(),
  async ({ tasksId, rolesId = [], disconnect, ...data }) => {
    let task1
    tasksId.forEach(async (taskId) => {
      task1 = await updateTask(taskId, rolesId, disconnect)
    })
    return task1
  }
)
