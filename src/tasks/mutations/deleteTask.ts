import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteTaskSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteTaskSchema),
  resolver.authorize(),
  async ({ id, columnId }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    // Delete the task from the task table
    const task = await db.task.deleteMany({ where: { id } })

    // Delete the taskId from the list of Ids in the column taskOrder (for kanban board)
    // Right now it is not possible to splice one value but have to reset the whole list
    // Create the new list without the task id
    // Fetch taskOrder
    const column = await db.column.findUnique({
      where: { id: columnId },
      select: { taskOrder: true },
    })

    // Delete taskId
    const updatedTaskOrder = column.taskOrder.filter((taskId) => taskId !== id)

    // Update the taskOrder field in the Column model
    await db.column.update({
      where: { id: columnId },
      data: {
        taskOrder: {
          set: updatedTaskOrder,
        },
      },
    })

    return task
  }
)
