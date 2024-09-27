import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateRoleSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateRoleSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const role = await db.role.update({ where: { id }, data })

    return role
  }
)
