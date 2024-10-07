import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetTeam = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
  include: z
    .object({
      projectMembers: z.boolean().optional(),
      assignments: z.boolean().optional(),
    })
    .optional(),
})

export default resolver.pipe(
  resolver.zod(GetTeam),
  resolver.authorize(),
  async ({ id, include }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const team = await db.team.findFirst({ where: { id }, include })

    if (!team) throw new NotFoundError()

    return team
  }
)
