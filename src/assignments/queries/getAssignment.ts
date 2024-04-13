import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetAssingmentInput extends Pick<Prisma.AssignmentFindFirstArgs, "where" | "include"> {}

export default resolver.pipe(resolver.authorize(), async ({ where }: GetAssingmentInput) => {
  const assignment = await db.assignment.findFirst({ where })

  // if (!assignment) throw new NotFoundError()

  return assignment
})
