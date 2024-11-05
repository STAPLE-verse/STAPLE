import { resolver } from "@blitzjs/rpc"
import db from "db"
import { AcceptInviteSchema } from "../schemas"
import sendNotification from "src/notifications/mutations/sendNotification"
import { getPrivilegeText } from "src/core/utils/getPrivilegeText"

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

    // Create the project privilege
    const projectPrivilege = await db.projectPrivilege.create({
      data: {
        userId: userId,
        projectId: invite.projectId,
        privilege: invite.privilege,
      },
    })

    // Create the project member
    const projectmember = await db.projectMember.create({
      data: {
        users: {
          connect: { id: userId },
        },
        projectId: invite!.projectId,
      },
    })

    // Assign roles to the project member
    if (invite.roles && invite.roles.length > 0) {
      await db.projectMember.update({
        where: { id: projectmember.id },
        data: {
          roles: {
            connect: invite.roles.map((role) => ({ id: role.id })),
          },
        },
      })
    }

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
