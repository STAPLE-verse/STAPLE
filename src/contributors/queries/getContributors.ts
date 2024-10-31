import { resolver } from "@blitzjs/rpc"
import db from "db"
import { ProjectMember, User } from "db"

export type ContributorWithUser = ProjectMember & {
  users: User[]
}

interface GetContributorsInput {
  projectId: number
  deleted?: boolean
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ projectId, deleted }: GetContributorsInput): Promise<ContributorWithUser[]> => {
    // Directly query the database for contributors
    const contributors = await db.projectMember.findMany({
      where: {
        projectId: projectId,
        deleted: deleted,
        name: null, // Ensures we're only getting contributors (where name is null)
      },
      orderBy: { id: "asc" },
      include: {
        users: true, // Include the related users
      },
    })

    // Check if any contributor has more than one user and throw an error
    contributors.forEach((contributor) => {
      if (contributor.users.length !== 1) {
        throw new Error(
          `Contributor with ID ${contributor.id} has ${contributor.users.length} users! Expected exactly 1.`
        )
      }
    })

    return contributors // This is automatically typed as ContributorWithUser[]
  }
)
