import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteMilestoneSchema } from "../schemas"

import { requireManagerOf } from "src/projectprivileges/utils/requireAccess"
export default resolver.pipe(
  resolver.zod(DeleteMilestoneSchema),
  resolver.authorize(),
  async ({ id }, ctx) => {
    await requireManagerOf(ctx, "milestone", [id])
    const milestone = await db.milestone.deleteMany({ where: { id } })

    return milestone
  }
)
