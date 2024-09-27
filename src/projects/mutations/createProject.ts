import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateProjectSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateProjectSchema),
  resolver.authorize(),
  async (input, ctx) => {
    const userId = ctx.session.userId
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const project = await db.project.create({
      data: {
        // Inputs from project creation form
        ...input,
        // Initialize project with "To Do", "In Progress", "Done" kanban board columns
        columns: {
          create: [
            {
              name: "To Do",
              columnIndex: 0,
            },
            {
              name: "In Progress",
              columnIndex: 1,
            },
            {
              name: "Done",
              columnIndex: 2,
            },
          ],
        },
      },
      include: {
        columns: true,
      },
    })

    // Create a contributor row to associate the current user with the project
    await db.contributor.create({
      data: {
        userId,
        projectId: project.id,
        // Since MemberPrivileges defaults to project manager the new contributor will be the project manager
      },
    })

    return project
  }
)
