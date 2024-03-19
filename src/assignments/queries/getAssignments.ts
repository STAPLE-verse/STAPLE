import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

export const revalidate = 0
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

interface GetAssignmentsInput
  extends Pick<Prisma.AssignmentFindManyArgs, "where" | "orderBy" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, include }: GetAssignmentsInput) => {
    const assignments = await db.assignment.findMany({
      where,
      orderBy,
      include,
    })

    return assignments || []
  }
)
