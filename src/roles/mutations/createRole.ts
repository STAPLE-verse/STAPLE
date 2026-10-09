import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateRoleSchema } from "../schemas"

import { requireSelf } from "src/projectprivileges/utils/requireAccess"
export default resolver.pipe(
  resolver.zod(CreateRoleSchema),
  resolver.authorize(),
  async (input, ctx) => {
    requireSelf(ctx, input.userId)

    const role = await db.role.create({ data: input })

    return role
  }
)
