import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { ProjectMemberWithUsers } from "src/core/types"

interface GetTeamInput {
  teamId: number
  projectId: number
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ teamId, projectId }: GetTeamInput): Promise<ProjectMemberWithUsers> => {
    const team = await db.projectMember.findFirst({
      where: {
        id: teamId,
        projectId: projectId,
        name: { not: null }, // Ensures we're only fetching teams with a name
      },
      include: {
        users: {
          where: {
            projects: {
              some: {
                name: null, // Ensures it's a contributor (no name)
                deleted: false, // Only fetches active contributors
                projectId: projectId, // Matches the project ID
              },
            },
          },
        },
      },
    })

    if (!team) throw new NotFoundError()

    return team as ProjectMemberWithUsers
  }
)
