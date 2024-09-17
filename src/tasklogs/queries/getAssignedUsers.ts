import { resolver } from "@blitzjs/rpc"
import db, { Assignment, Prisma } from "db"

interface GetAssignedUsersInput {
  taskId: number
}

export default resolver.pipe(resolver.authorize(), async ({ taskId }: GetAssignedUsersInput) => {
  const assignments = await db.assignment.findMany({
    where: { taskId: taskId },
    include: {
      projectMember: true,
      team: {
        include: {
          projectMembers: true,
        },
      },
    },
  })

  // Collect userIds from direct projectMembers
  const directContributorUserIds = assignments.flatMap((assignment) =>
    assignment.projectMember ? [assignment.projectMember.userId] : []
  )

  // Collect userIds from team-assigned projectMembers
  const teamContributorUserIds = assignments.flatMap((assignment) =>
    assignment.team
      ? assignment.team.projectMembers.map((projectMember) => projectMember.userId)
      : []
  )

  // Combine and deduplicate userIds
  const userIds = Array.from(new Set([...directContributorUserIds, ...teamContributorUserIds]))

  return userIds
})
