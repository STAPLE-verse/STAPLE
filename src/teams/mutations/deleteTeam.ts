import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteTeamSchema } from "../schemas"

import { requireManagerOf } from "src/projectprivileges/utils/requireAccess"
export default resolver.pipe(
  resolver.zod(DeleteTeamSchema),
  resolver.authorize(),
  async ({ id }, ctx) => {
    await requireManagerOf(ctx, "projectMember", [id])
    const team = await db.projectMember.update({ where: { id }, data: { deleted: true } })

    return team
  }
)
