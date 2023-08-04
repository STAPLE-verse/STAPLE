import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateTaskOrderSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateTaskOrderSchema),
  resolver.authorize(),
  async ({ activeId, overId, activeIndex, overIndex }) => {
    // Update the columnTaskIndex for the task of oldTaskId
    const updateActiveTask = db.task.update({
      where: { id: activeId },
      data: { columnTaskIndex: overIndex },
    })

    // Update the columnTaskIndex for the task of newTaskId
    const updateOverTask = db.task.update({
      where: { id: overId },
      data: { columnTaskIndex: activeIndex },
    })

    // Perform both updates concurrently using Promise.all
    await Promise.all([updateActiveTask, updateOverTask])

    // Return a success message or any relevant response
    return { message: "Task order updated successfully" }
  }
)
