import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateRoleSchema } from "../schemas"

import { requireRoleAccess } from "src/projectprivileges/utils/requireAccess"
export default resolver.pipe(
  resolver.zod(UpdateRoleSchema),
  resolver.authorize(),
  async ({ id, userId: _ignoredOwner, ...data }, ctx) => {
    await requireRoleAccess(ctx, [id])
    const role = await db.role.update({ where: { id }, data })

    return role
  }
)
