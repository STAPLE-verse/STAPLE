import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteInviteSchema } from "../schemas"

import { requireInviteAccess } from "src/projectprivileges/utils/requireAccess"
export default resolver.pipe(
  resolver.zod(DeleteInviteSchema),
  resolver.authorize(),
  async ({ id }, ctx) => {
    await requireInviteAccess(ctx, id, { allowInvitee: true, allowManager: true })
    const invite = await db.invitation.deleteMany({ where: { id } })

    return invite
  }
)
