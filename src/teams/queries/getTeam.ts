import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { TeamWithUsers, PendingTeamInvitee } from "src/core/types"

interface GetTeamInput {
  id: number
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ id }: GetTeamInput): Promise<TeamWithUsers> => {
    const team = await db.projectMember.findUnique({
      where: {
        id: id,
      },
      include: {
        users: {
          include: {
            projects: true, // all ProjectMember memberships for the user
          },
        },
        pendingInvitations: {
          select: { id: true, email: true },
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

    const pendingInvitations: PendingTeamInvitee[] = (team.pendingInvitations || []).map((inv) => ({
      id: inv.id,
      email: inv.email,
    }))

    return {
      id: team.id,
      projectId: team.projectId,
      name: team.name,
      users: usersWithContributorIds,
      pendingInvitations,
      createdAt: team.createdAt,
      tags: team.tags,
    }
  }
)
