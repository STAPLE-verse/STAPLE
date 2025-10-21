import { resolver } from "@blitzjs/rpc"
import db from "db"
import { Routes } from "@blitzjs/next"
import sendNotification from "src/notifications/mutations/sendNotification"
import { UpdateTeamSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateTeamSchema),
  resolver.authorize(),
  async ({ id, name, userIds, tags }, ctx) => {
    // Fetch existing users and projectId for this team to compute newly added users
    const existing = await db.projectMember.findFirst({
      where: { id },
      select: {
        projectId: true,
        name: true,
        users: { select: { id: true } },
      },
    })

    const existingUserIds = new Set((existing?.users || []).map((u) => u.id))
    const newlyAddedUserIds = (userIds || []).filter((uid) => !existingUserIds.has(uid))

    const team = await db.projectMember.update({
      where: { id },
      data: {
        name: name,
        users: {
          set: userIds.map((userId) => ({
            id: userId,
          })),
        },
        tags: tags ?? undefined,
      },
      include: {
        users: true, // Include the users relation in the result
      },
    })

    // If any users were newly added, notify them
    if (newlyAddedUserIds.length > 0 && existing?.projectId) {
      // Resolve project name
      const project = await db.project.findFirst({
        where: { id: existing.projectId },
        select: { name: true },
      })

      // Resolve actor name from ctx.session.userId
      let addedBy = "Project Admin"
      if (ctx?.session?.userId) {
        const actor = await db.user.findFirst({
          where: { id: ctx.session.userId },
          select: { firstName: true, lastName: true, username: true },
        })
        if (actor) {
          addedBy =
            actor.firstName && actor.lastName
              ? `${actor.firstName} ${actor.lastName}`
              : actor.username || addedBy
        }
      }

      await sendNotification(
        {
          templateId: "addedToTeam",
          recipients: newlyAddedUserIds,
          data: {
            teamName: team.name || existing?.name || "Unnamed Team",
            projectName: project?.name || "Unnamed Project",
            addedby: addedBy,
          },
          projectId: existing.projectId,
          routeData: {
            path: Routes.ShowTeamPage({ projectId: existing.projectId, teamId: team.id }).href,
          },
        },
        ctx
      )
    }

    return team
  }
)
