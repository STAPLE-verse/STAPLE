import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetInvitationInput
  extends Pick<Prisma.InvitationFindManyArgs, "where" | "orderBy" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, include }: GetInvitationInput) => {
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
      where: normalizedWhere,
      orderBy,
      include,
    })

    return invites || []
  }
)
