import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateTaskSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateTaskSchema),
  resolver.authorize(),
  async ({ projectId, columnId, name, description }) => {
    // Get tasks for the column inside the project
    const columnTaskIndex = await db.task.count({
      where: {
        projectId: projectId, // Filter tasks by projectId
        columnId: columnId, // Filter tasks by columnId
      },
    })

    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const task = await db.task.create({
      data: {
        name,
        description,
        columnTaskIndex,
        project: {
          connect: { id: projectId },
        },
        column: {
          // TODO: replace this later with actual logic
          connect: { id: columnId },
        },
      },
    })

    return task
  }
)
