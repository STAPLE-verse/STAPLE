import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteInviteSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteInviteSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const invite = await db.invitation.deleteMany({ where: { id } })

    return invite
  }
)
