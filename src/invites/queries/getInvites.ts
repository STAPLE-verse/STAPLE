import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

import { getProjectAccess } from "src/projectprivileges/utils/getProjectAccess"
import { andWhere } from "src/projectprivileges/utils/scopeReadQuery"
interface GetInvitationInput
  extends Pick<Prisma.InvitationFindManyArgs, "where" | "orderBy" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, include }: GetInvitationInput, ctx) => {
    const userId = ctx.session.userId as number
    const access = await getProjectAccess(userId)
    const me = await db.user.findUnique({ where: { id: userId }, select: { email: true } })
    // An invitation is for the person it was sent to, and for the managers of its project
    const mayRead: Prisma.InvitationWhereInput = {
      OR: [
        { email: { equals: me?.email ?? "", mode: "insensitive" } },
        { projectId: { in: access.managerProjectIds } },
      ],
    }

    // Normalize email filter to be case-insensitive if present
    const normalizedWhere: Prisma.InvitationWhereInput | undefined = where
      ? { ...where }
      : undefined

    if (normalizedWhere && typeof (normalizedWhere as any).email === "string") {
      ;(normalizedWhere as any).email = {
        equals: (normalizedWhere as any).email,
        mode: "insensitive",
      }
    } else if (
      normalizedWhere &&
      (normalizedWhere as any).email &&
      typeof (normalizedWhere as any).email === "object" &&
      typeof (normalizedWhere as any).email.equals === "string"
    ) {
      ;(normalizedWhere as any).email = {
        ...(normalizedWhere as any).email,
        mode: "insensitive",
      }
    }

    const invites = await db.invitation.findMany({
      where: andWhere(normalizedWhere, mayRead),
      orderBy,
      include,
    })

    return invites || []
  }
)
