import { resolver } from "@blitzjs/rpc"
import db, { AutoAssignNew, CompletedAs } from "db"
import { AcceptInviteSchema } from "../schemas"
import sendNotification from "src/notifications/mutations/sendNotification"
import { getPrivilegeText } from "src/core/utils/getPrivilegeText"
import { Routes } from "@blitzjs/next"

export default resolver.pipe(
  resolver.zod(AcceptInviteSchema),
  resolver.authorize(),
  async ({ id, userId }, ctx) => {
    // Find the invitation and related roles
    const invite = await db.invitation.findUnique({
      where: { id },
      include: { roles: true },
    })
    if (!invite) throw new Error("Invitation not found")

    let projectMember

    // Check if this is a reassignment invitation
    if (invite.reassignmentFor) {
      // Restore the soft-deleted ProjectMember
      projectMember = await db.projectMember.update({
        where: { id: invite.reassignmentFor },
        data: { deleted: false },
      })
    } else {
      // Create a new ProjectMember for fresh invitations
      projectMember = await db.projectMember.create({
        data: {
          users: {
            connect: { id: userId },
          },
          projectId: invite.projectId,
          tags: invite.tags as any,
        },
      })
    }

    // Create the project privilege
    const projectPrivilege = await db.projectPrivilege.create({
      data: {
        userId: userId,
        projectId: invite.projectId,
        privilege: invite.privilege,
      },
    })

    // Assign roles to the project member
    if (invite.roles && invite.roles.length > 0) {
      await db.projectMember.update({
        where: { id: projectMember.id },
        data: {
          roles: {
            connect: invite.roles.map((role) => ({ id: role.id })),
          },
        },
      })
    }

    // --- Auto-assign this member to tasks marked for contributors or all ---

    const tasksToAutoAssign = await db.task.findMany({
      where: {
        projectId: invite.projectId,
        autoAssignNew: { in: [AutoAssignNew.ALL, AutoAssignNew.CONTRIBUTOR] },
      },
      select: {
        id: true,
        name: true,
        deadline: true,
        autoAssignNew: true,
        createdBy: { include: { users: true } },
      },
    })

    try {
      if (tasksToAutoAssign.length > 0) {
        await Promise.all(
          tasksToAutoAssign.map((t) =>
            db.task.update({
              where: { id: t.id },
              data: {
                assignedMembers: { connect: { id: projectMember.id } },
              },
            })
          )
        )

        // Create TaskLog entries for these auto-assignments
        await Promise.all(
          tasksToAutoAssign.map((t) =>
            db.taskLog.create({
              data: {
                taskId: t.id,
                assignedToId: projectMember.id,
                completedAs: CompletedAs.INDIVIDUAL,
              },
            })
          )
        )

        // Send a notification for each auto-assigned task
        await Promise.all(
          tasksToAutoAssign.map(async (t) => {
            const createdByUsername = t.createdBy?.users?.[0]
              ? t.createdBy.users[0].firstName && t.createdBy.users[0].lastName
                ? `${t.createdBy.users[0].firstName} ${t.createdBy.users[0].lastName}`
                : t.createdBy.users[0].username
              : "Auto Assigned"

            await sendNotification(
              {
                templateId: "taskAssigned",
                recipients: [userId],
                data: {
                  taskName: t.name || "Unnamed Task",
                  createdBy: createdByUsername,
                  deadline: t.deadline || null,
                },
                projectId: invite.projectId,
                routeData: {
                  path: Routes.ShowTaskPage({ projectId: invite.projectId, taskId: t.id }).href,
                },
              },
              ctx
            )
          })
        )
      }
    } catch (err) {
      console.error("[acceptInvite] Auto-assign flow error", err)
    }
    // --- end auto-assign block ---

    // Get information for the notification
    const project = await db.project.findFirst({ where: { id: invite.projectId } })
    if (!project) throw new Error("Project not found")

    // Send notification
    await sendNotification(
      {
        templateId: "addedToProject",
        recipients: [userId],
        data: {
          projectName: project.name,
          addedBy: invite.addedBy,
          privilege: getPrivilegeText(projectPrivilege.privilege),
        },
        projectId: project.id,
        routeData: {
          path: Routes.InvitesPage().href,
        },
      },
      ctx
    )

    // Delete invitation(s) for that email and project Id
    await db.invitation.deleteMany({
      where: {
        email: invite.email,
        projectId: invite.projectId,
      },
    })

    return project
  }
)
