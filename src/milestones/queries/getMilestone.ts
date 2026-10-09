import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

import { requireMemberOf } from "src/projectprivileges/utils/requireAccess"
const GetMilestone = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetMilestone),
  resolver.authorize(),
  async ({ id }, ctx) => {
    await requireMemberOf(ctx, "milestone", [id as number])
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const milestone = await db.milestone.findFirst({
      where: { id },
      include: {
        task: true,
      },
    })

    if (!milestone) throw new NotFoundError()

    return milestone
  }
)
