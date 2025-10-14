import { resolver } from "@blitzjs/rpc"
import db, { CompletedAs } from "db"
import { CreateTeamSchema } from "../schemas"
import { Routes } from "@blitzjs/next"
import sendNotification from "src/notifications/mutations/sendNotification"

export default resolver.pipe(
  resolver.zod(CreateTeamSchema),
  resolver.authorize(),
  async ({ projectId, name, userIds, tags }, ctx) => {
    const team = await db.projectMember.create({
      data: {
        name,
        project: {
          connect: { id: projectId },
        },
        users: {
          connect: userIds.map((userId) => ({
            id: userId,
          })),
        },
        ...(tags && { tags }),
      },
    })

    // Resolve project name and actor name for notifications
    const project = await db.project.findFirst({
      where: { id: projectId },
      select: { name: true },
    })

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
        recipients: userIds,
        data: {
          teamName: name || "Unnamed Team",
          projectName: project?.name || "Unnamed Project",
          addedby: addedBy,
        },
        projectId,
        routeData: {
          path: Routes.ShowTeamPage({ projectId, teamId: team.id }).href,
        },
      },
      ctx
    )

    // Auto-assign this team to tasks configured to add all new teams
    const tasksToAutoAssign = await db.task.findMany({
      where: { projectId, autoAssignNew: { in: ["ALL", "TEAM"] } },
      select: { id: true },
    })

    if (tasksToAutoAssign.length > 0) {
      // Connect the team as an assigned member on each task
      await Promise.all(
        tasksToAutoAssign.map((t) =>
          db.task.update({
            where: { id: t.id },
            data: {
              assignedMembers: { connect: { id: team.id } },
            },
          })
        )
      )

      // Create TaskLog entries for team assignments
      await Promise.all(
        tasksToAutoAssign.map((t) =>
          db.taskLog.create({
            data: {
              taskId: t.id,
              assignedToId: team.id,
              completedAs: CompletedAs.TEAM,
            },
          })
        )
      )

      // Notify team users that their team was added to each task
      const uniqueUserIds = Array.from(new Set(userIds))

      await Promise.all(
        tasksToAutoAssign.map(async (t) => {
          const task = await db.task.findFirst({
            where: { id: t.id },
            select: { name: true, deadline: true, createdBy: { include: { users: true } } },
          })

          const createdByUsername = task!.createdBy.users[0]
            ? task!.createdBy.users[0].firstName && task!.createdBy.users[0].lastName
              ? `${task!.createdBy.users[0].firstName} ${task!.createdBy.users[0].lastName}`
              : task!.createdBy.users[0].username
            : null

          await sendNotification(
            {
              templateId: "taskAssigned",
              recipients: uniqueUserIds,
              data: {
                taskName: task?.name || "Unnamed Task",
                createdBy: createdByUsername || "Auto Assigned",
                deadline: task?.deadline || null,
              },
              projectId,
              routeData: {
                path: Routes.ShowTaskPage({ projectId, taskId: t.id }).href,
              },
            },
            ctx
          )
        })
      )
    }

    return team
  }
)
