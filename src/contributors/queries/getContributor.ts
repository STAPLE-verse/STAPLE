import { resolver } from "@blitzjs/rpc"
import { NotFoundError } from "blitz"
import db from "db"
import { ProjectMemberWithUsers } from "src/core/types"
import { getProjectAccess } from "src/projectprivileges/utils/getProjectAccess"

interface GetContributorInput {
  contributorId: number
  projectId: number
}

export default resolver.pipe(
  resolver.authorize(),
  async (
    { contributorId, projectId }: GetContributorInput,
    ctx
  ): Promise<ProjectMemberWithUsers | null> => {
    const userId = ctx.session.userId as number
    const access = await getProjectAccess(userId)

    // Not your project: reported as not found, so ids can't be probed
    if (!access.memberProjectIds.includes(projectId)) {
      throw new NotFoundError("Contributor not found")
    }

    // Directly query the database for the specific contributor, within this project
    const contributor = await db.projectMember.findFirst({
      where: { id: contributorId, projectId, name: null }, // name null means a person, not a team
      include: {
        users: true, // Include the related users
      },
    })

    // If no contributor is found, return null
    if (!contributor) {
      throw new NotFoundError("Contributor not found")
    }

    // Check if the contributor has more than one user and throw an error
    if (contributor.users.length !== 1) {
      throw new Error(`Contributor has ${contributor.users.length} users! Expected exactly 1.`)
    }

    // Project managers may open anyone in their project. Everyone else may open themselves and
    // the people on a team with them, which are the contributor pages the app links them to.
    if (!access.managerProjectIds.includes(projectId)) {
      const person = contributor.users[0]!
      const isSelf = person.id === userId
      const sharesATeam =
        !isSelf &&
        (await db.projectMember.findFirst({
          where: {
            projectId,
            name: { not: null },
            AND: [{ users: { some: { id: userId } } }, { users: { some: { id: person.id } } }],
          },
          select: { id: true },
        })) !== null
      if (!isSelf && !sharesATeam) throw new NotFoundError("Contributor not found")
    }

    return contributor // This is automatically typed as ProjectMemberWithUsers
  }
)
