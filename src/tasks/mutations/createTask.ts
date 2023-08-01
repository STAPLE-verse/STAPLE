import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateTaskSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateTaskSchema),
  resolver.authorize(),
  async ({ projectId, columnId, name, description }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const task = await db.task.create({
      data: {
        name,
        description,
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
