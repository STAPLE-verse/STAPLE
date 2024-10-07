import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetAssignmentStatusLogInput
  extends Pick<Prisma.AssignmentFindManyArgs, "where" | "orderBy" | "include"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, include }: GetAssignmentStatusLogInput) => {
    const assignmentStatusLog = await db.assignmentStatusLog.findMany({
      where,
      orderBy,
      include,
    })

    return assignmentStatusLog || []
  }
)
