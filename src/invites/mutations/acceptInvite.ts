import { resolver } from "@blitzjs/rpc"
import db from "db"
import { AcceptInviteSchema } from "../schemas"
import sendNotification from "src/notifications/mutations/sendNotification"
import { getPrivilegeText } from "src/services/getPrivilegeText"

export default resolver.pipe(
  resolver.zod(AcceptInviteSchema),
  resolver.authorize(),
  async ({ id, userId }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const invite = await db.invitation.findUnique({
      where: { id },
      include: { roles: true },
    })

    const projectmember = await db.projectMember.create({
      data: {
        userId: userId,
        projectId: invite!.projectId,
        privilege: invite!.privilege,
      },
    })

    //connect to roles
    let c1 = await db.projectMember.update({
      where: { id: projectmember.id },
      data: {
        roles: {
          connect: invite!.roles.map((role) => ({ id: role.id })) || [],
        },
      },
    })

    // Get information for the notification
    const project = await db.project.findFirst({ where: { id: invite!.projectId } })
    // Send notification
    await sendNotification(
      {
        templateId: "addedToProject",
        recipients: [projectmember.userId],
        data: {
          projectName: project!.name,
          addedBy: invite!.addedBy,
          privilege: getPrivilegeText(projectmember.privilege),
        },
        projectId: projectmember.projectId,
      },
      ctx
    )

    // delete invitation(s) for that email and project Id
    await db.invitation.deleteMany({
      where: {
        email: invite!.email,
        projectId: invite!.projectId,
      },
    })

    return project
  }
)
