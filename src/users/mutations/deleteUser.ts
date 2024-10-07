import { resolver } from "@blitzjs/rpc"
import db from "db"
import { NotFoundError } from "blitz"

export default resolver.pipe(resolver.authorize(), async (_, ctx) => {
  // Get user
  const user = await db.user.findUnique({
    where: { id: ctx.session.userId! },
  })
  if (!user) throw new NotFoundError()

  // TODO: Decide what to do with user information when the profile is deleted
  // Find all projects of the user
  const userProjects = await db.projectMember.findMany({
    where: {
      users: {
        some: {
          id: user.id, // Filter to include only project members that include this user
        },
      },
    },
    include: {
      project: {
        include: {
          projectMembers: true, // Include all project members
        },
      },
    },
  })
  if (!userProjects) throw new NotFoundError()

  userProjects.map(async (userProject) => {
    // Delete projects where there are no other projectmembers
    if (userProject.project.projectMembers.length === 1) {
      await db.project.delete({ where: { id: userProject.projectId } })
      // Keep projects with multiple projectmembers but delete user contribution modal
    } else if (userProject.project.projectMembers.length > 1) {
      await db.projectMember.delete({ where: { id: userProject.id } })
    }
  })

  await ctx.session.$revoke()

  await db.session.deleteMany({ where: { userId: user.id } })
  await db.user.delete({ where: { id: user.id } })

  return true
})
