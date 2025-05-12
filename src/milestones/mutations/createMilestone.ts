import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateMilestoneSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateMilestoneSchema),
  resolver.authorize(),
  async ({ projectId, name, description }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const milestone = await db.milestone.create({
      data: {
        name,
        description,
        project: {
          connect: { id: projectId },
        },
      },
    })

    return milestone
  }
)
