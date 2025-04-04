import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { TeamWithUsers } from "src/core/types"

interface GetTeamInput {
  teamId: number
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ teamId }: GetTeamInput): Promise<TeamWithUsers> => {
    const team = await db.projectMember.findUnique({
      where: {
        id: teamId,
      },
      include: {
        users: {
          include: {
            projects: true, // all ProjectMember memberships for the user
          },
        },
      },
    })

    if (!team || team.name === null) {
      throw new NotFoundError()
    }

    // Prepare a safe object for the client
    const usersWithContributorIds = team.users.map((user) => {
      const contributor = user.projects.find(
        (pm) => pm.projectId === team.projectId && pm.name === null && !pm.deleted
      )

      if (!contributor) {
        throw new Error(
          `Data integrity error: User ${user.username} is on team ${team.name} but has no individual contributor in project ${team.projectId}`
        )
      }

      return {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        contributorId: contributor.id,
      }
    })

    return {
      id: team.id,
      projectId: team.projectId,
      name: team.name,
      users: usersWithContributorIds,
    }
  }
)
