import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateMilestoneDatesSchema } from "../schemas"

import { requireManagerOf } from "src/projectprivileges/utils/requireAccess"
export default resolver.pipe(
  resolver.zod(UpdateMilestoneDatesSchema),
  resolver.authorize(),
  async ({ id, ...data }, ctx) => {
    await requireManagerOf(ctx, "milestone", [id])
    const milestone = await db.milestone.update({
      where: { id },
      data,
    })

    return milestone
  }
)
