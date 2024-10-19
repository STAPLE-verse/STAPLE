import { resolver } from "@blitzjs/rpc"
import db from "db"
import { ContributorWithUser } from "./getContributors"

interface GetContributorInput {
  contributorId: number
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ contributorId }: GetContributorInput): Promise<ContributorWithUser | null> => {
    // Directly query the database for the specific contributor
    const contributor = await db.projectMember.findFirst({
      where: { id: contributorId, name: null }, // Ensures we're getting a contributor (where name is null)
      include: {
        users: true, // Include the related users
      },
    })

    // If no contributor is found, return null
    if (!contributor) {
      throw new Error("Contributor not found")
    }

    // Check if the contributor has more than one user and throw an error
    if (contributor.users.length !== 1) {
      throw new Error(`Contributor has ${contributor.users.length} users! Expected exactly 1.`)
    }

    return contributor // This is automatically typed as ContributorWithUser
  }
)
