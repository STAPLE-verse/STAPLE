import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetInvitationInput
  extends Pick<Prisma.InvitationFindManyArgs, "where" | "orderBy" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, include }: GetInvitationInput) => {
    const invites = await db.invitation.findMany({
      where,
      orderBy,
      include,
    })

    return invites || []
  }
)
