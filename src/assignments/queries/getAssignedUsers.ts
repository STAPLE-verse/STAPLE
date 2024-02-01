import { resolver } from "@blitzjs/rpc"
import db, { Assignment, Prisma } from "db"

interface GetAssignedUsersInput {
  taskId: number
}

export default resolver.pipe(resolver.authorize(), async ({ taskId }: GetAssignedUsersInput) => {
  const assignments = await db.assignment.findMany({
    where: { taskId: taskId },
    // Also get userId for assignments
    include: { contributor: { select: { userId: true } } },
  })

  const userIds = assignments.map((assignment) => assignment.contributor.userId)

  return userIds
})
