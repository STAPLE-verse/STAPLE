import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteColumnSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteColumnSchema),
  resolver.authorize(),
  async ({ id }) => {
    const column = await db.kanbanBoard.findUnique({
      where: { id: id },
      include: { tasks: true },
    })

    if (!column) {
      throw new Error("Column not found.")
    }

    // Prevent deletion of the "Done" column
    if (column.name.trim().toLowerCase() === "done") {
      throw new Error("The 'Done' column cannot be deleted.")
    }

    // Block deletion if there are still tasks in it
    if (column.tasks.length > 0) {
      throw new Error("Please move all tasks out of this column before deleting it.")
    }

    await db.kanbanBoard.delete({ where: { id: id } })

    return { id: id, message: "Column deleted successfully." }
  }
)
