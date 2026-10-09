import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

import { getProjectAccess } from "src/projectprivileges/utils/getProjectAccess"
const GetRole = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetRole), resolver.authorize(), async ({ id }, ctx) => {
  const userId = ctx.session.userId as number
  const access = await getProjectAccess(userId)
  const role = await db.role.findFirst({
    where: { id, OR: [{ userId }, { projectId: { in: access.memberProjectIds } }] },
  })

  if (!role) throw new NotFoundError()

  return role
})
