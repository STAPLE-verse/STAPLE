import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateTaskOrderSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateTaskOrderSchema),
  resolver.authorize(),
  async ({ columnId, oldIndex, newIndex }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    // Get the column data from the database
    const column = await db.column.findUnique({ where: { id: columnId }, include: { tasks: true } })

    if (!column) {
      throw new Error(`Column with id ${columnId} not found.`)
    }

    // Ensure that the oldIndex and newIndex are within bounds
    if (
      oldIndex < 0 ||
      oldIndex >= column.tasks.length ||
      newIndex < 0 ||
      newIndex >= column.tasks.length
    ) {
      throw new Error("Invalid oldIndex or newIndex.")
    }

    // Reorder the tasks array based on the provided oldIndex and newIndex
    const reorderedTasks = [...column.tasks]
    const [removedTask] = reorderedTasks.splice(oldIndex, 1)
    reorderedTasks.splice(newIndex, 0, removedTask)

    // Update the tasks array in the column row
    const updatedColumn = await db.column.update({
      where: { id: columnId },
      data: {
        tasks: { set: reorderedTasks },
      },
      include: { tasks: true }, // Include the updated tasks in the response
    })

    // Return the updated column with the tasks array
    return updatedColumn
  }
)
