import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

// Validate input: the invite code should be a non-empty string
const GetInviteByCode = z.object({
  code: z.string().min(1),
})

export default resolver.pipe(resolver.zod(GetInviteByCode), async ({ code }) => {
  // Look up the invite by its unique code
  const invite = await db.invitation.findFirst({
    where: { invitationCode: code },
    select: {
      id: true,
      projectId: true,
      email: true,
      privilege: true,
      roles: true,
    },
  })

  return invite
})
