import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateRoleSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateRoleSchema),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant

    const role = await db.role.create({ data: input })

    return role
  }
)
