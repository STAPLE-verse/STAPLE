import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateProjectSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateProjectSchema),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const project = await db.project.create({
      data: {
        ...input,
        columns: {
          create: [
            {
              name: "To Do",
            },
            {
              name: "In Progress",
            },
            {
              name: "Done",
            },
          ],
        },
      },
      include: {
        columns: true,
      },
    })
    // Initialize project with "To Do", "In Progress", "Done" kanban board columns

    return project
  }
)
