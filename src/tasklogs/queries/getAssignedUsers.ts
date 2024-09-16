import { resolver } from "@blitzjs/rpc"
import db, { Assignment, Prisma } from "db"

interface GetAssignedUsersInput {
  taskId: number
}

export default resolver.pipe(resolver.authorize(), async ({ taskId }: GetAssignedUsersInput) => {
  const assignments = await db.assignment.findMany({
    where: { taskId: taskId },
    include: {
      contributor: true,
      team: {
        include: {
          contributors: true,
        },
      },
    },
  })

  // Collect userIds from direct contributors
  const directContributorUserIds = assignments.flatMap((assignment) =>
    assignment.contributor ? [assignment.contributor.userId] : []
  )

  // Collect userIds from team-assigned contributors
  const teamContributorUserIds = assignments.flatMap((assignment) =>
    assignment.team ? assignment.team.contributors.map((contributor) => contributor.userId) : []
  )

  // Combine and deduplicate userIds
  const userIds = Array.from(new Set([...directContributorUserIds, ...teamContributorUserIds]))

  return userIds
})
