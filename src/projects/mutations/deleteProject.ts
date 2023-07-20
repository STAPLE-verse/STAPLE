import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteProjectSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteProjectSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    // Delete tasks if the parent project is deleted
    await db.task.deleteMany({ where: { projectId: id } })
    const project = await db.project.deleteMany({ where: { id } })

    return project
  }
)
