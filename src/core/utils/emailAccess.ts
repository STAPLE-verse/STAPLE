import db from "db"
import { getProjectAccess } from "src/projectprivileges/utils/getProjectAccess"

// The one sender address STAPLE's own messages use, and the helpdesk that feedback goes to
export const ALLOWED_FROM = "STAPLE <app@staplescience.com>"
export const HELPDESK = "staple.helpdesk@gmail.com"

// The send-email route is called from the browser with a finished message, so on its own it
// would let any visitor send any email, from STAPLE's address, to anyone. A message is only
// sent if it is one of STAPLE's own kinds: from the STAPLE address, to a single recipient who is
// the signed-in person (profile and password notices), the helpdesk (feedback), or someone the
// person has invited to a project they manage (invitations).
export async function mayEmail(userId: number, msg: unknown): Promise<boolean> {
  if (!msg || typeof msg !== "object") return false
  const { from, to } = msg as { from?: unknown; to?: unknown }
  if (from !== ALLOWED_FROM) return false
  if (typeof to !== "string") return false // one recipient at a time
  const recipient = to.trim().toLowerCase()
  if (!recipient) return false

  if (recipient === HELPDESK) return true

  const me = await db.user.findUnique({ where: { id: userId }, select: { email: true } })
  if (me && me.email.toLowerCase() === recipient) return true

  const access = await getProjectAccess(userId)
  const invitation = await db.invitation.findFirst({
    where: {
      email: { equals: recipient, mode: "insensitive" },
      projectId: { in: access.managerProjectIds },
    },
    select: { id: true },
  })
  return invitation !== null
}
