import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteMilestoneSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteMilestoneSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const milestone = await db.milestone.deleteMany({ where: { id } })

    return milestone
  }
)
