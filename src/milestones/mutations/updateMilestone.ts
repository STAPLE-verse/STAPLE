import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateMilestoneSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateMilestoneSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    const milestone = await db.milestone.update({ where: { id }, data })

    return milestone
  }
)
