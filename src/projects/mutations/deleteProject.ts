import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteProjectSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteProjectSchema),
  resolver.authorize(),
  async ({ id }) => {
    // Delete related ProjectWidgets if the parent project is deleted
    await db.projectWidget.deleteMany({ where: { projectId: id } })
    // Delete tasks if the parent project is deleted
    await db.task.deleteMany({ where: { projectId: id } })
    // Delete elements if the parent project is deleted
    await db.element.deleteMany({ where: { projectId: id } })
    // Delete project specific projectMembers if project is deleted
    await db.projectMember.deleteMany({ where: { projectId: id } })
    // Delete project privileges
    await db.projectPrivilege.deleteMany({ where: { projectId: id } })
    // Delete the notifications related to the project
    await db.notification.deleteMany({
      where: { projectId: id },
    })
    // Delete the project itself
    const project = await db.project.deleteMany({ where: { id } })

    return project
  }
)
