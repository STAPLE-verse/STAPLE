import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteRoleSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteRoleSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const role = await db.role.deleteMany({ where: { id } })

    return role
  }
)
