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
    // Delete elements if the parent project is deleted
    await db.element.deleteMany({ where: { projectId: id } })
    // Delete project specific contributors if project is deleted
    await db.contributor.deleteMany({ where: { projectId: id } })
    // Delete the project itself
    const project = await db.project.deleteMany({ where: { id } })

    return project
  }
)
