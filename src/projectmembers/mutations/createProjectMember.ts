import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateProjectMemberSchema } from "../schemas"
import sendNotification from "src/notifications/mutations/sendNotification"
import { getPrivilegeText } from "src/services/getPrivilegeText"

export default resolver.pipe(
  resolver.zod(CreateProjectMemberSchema),
  resolver.authorize(),
  async ({ invitationCode, userId }, ctx) => {
    var textResult
    // get the invitation information
    const projectInvite = await db.invitation.findFirst({
      where: {
        invitationCode: invitationCode,
      },
      include: {
        roles: true,
      },
    })

    if (projectInvite) {
      // Create projectMember
      const projectMember = await db.projectMember.create({
        data: {
          userId: userId,
          projectId: projectInvite!.projectId,
          privilege: projectInvite!.privilege,
        },
      })

      //connect to roles
      let c1 = await db.projectMember.update({
        where: { id: projectMember.id },
        data: {
          roles: {
            connect: projectInvite!.roles.map((role) => ({ id: role.id })) || [],
          },
        },
      })

      // Get information for the notification
      const project = await db.project.findFirst({ where: { id: projectInvite!.projectId } })
      // Send notification
      await sendNotification(
        {
          templateId: "addedToProject",
          recipients: [projectMember.userId],
          data: {
            projectName: project!.name,
            addedBy: projectInvite!.addedBy,
            privilege: getPrivilegeText(projectMember.privilege),
          },
          projectId: projectMember.projectId,
        },
        ctx
      )

      // delete invitation(s) for that email and project Id
      await db.invitation.deleteMany({
        where: {
          email: projectInvite!.email,
          projectId: projectInvite!.projectId,
        },
      })
      textResult = {
        code: "worked",
        projectId: projectInvite!.projectId,
      }
    } else {
      textResult = {
        code: "no_code",
      }
    }
    return textResult
  }
)
