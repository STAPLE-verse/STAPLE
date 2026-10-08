import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteRoleSchema } from "../schemas"

import { requireRoleAccess } from "src/projectprivileges/utils/requireAccess"
export default resolver.pipe(
  resolver.zod(DeleteRoleSchema),
  resolver.authorize(),
  async ({ id }, ctx) => {
    await requireRoleAccess(ctx, [id])
    const role = await db.role.deleteMany({ where: { id } })

    return role
  }
)
