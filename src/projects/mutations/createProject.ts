import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateProjectSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateProjectSchema),
  resolver.authorize(),
  async (input, ctx) => {
    const userId = ctx.session.userId
    const project = await db.project.create({
      data: {
        // Inputs from project creation form
        ...input,
        // Initialize project with "To Do", "In Progress", "Done" kanban board columns
        containers: {
          create: [
            {
              name: "To Do",
              containerOrder: 0,
            },
            {
              name: "In Progress",
              containerOrder: 1,
            },
            {
              name: "Done",
              containerOrder: 2,
            },
          ],
        },
      },
      include: {
        containers: true,
      },
    })

    // Create project member row for "individuals"
    await db.projectMember.create({
      data: {
        projectId: project.id,
        users: {
          connect: { id: userId }, // Connect an existing user to the project member
        },
      },
    })

    // Create project privileges
    await db.projectPrivilege.create({
      data: {
        projectId: project.id,
        userId: userId,
      },
    })

    return project
  }
)
