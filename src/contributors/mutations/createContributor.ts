import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateContributorSchema } from "../schemas"
import sendNotification from "src/notifications/mutations/sendNotification"
import { getPrivilegeText } from "src/services/getPrivilegeText"

export default resolver.pipe(
  resolver.zod(CreateContributorSchema),
  resolver.authorize(),
  async ({ invitationCode, userId }, ctx) => {
    var textResult
    // get the invitation information
    const projectInvite = await db.invitation.findFirst({
      where: {
        invitationCode: invitationCode,
      },
    })

    if (projectInvite) {
      // Create contributor
      const contributor = await db.contributor.create({
        data: {
          userId: userId,
          projectId: projectInvite!.projectId,
          privilege: projectInvite!.privilege,
        },
      })

      //connect to labels
      let c1 = await db.contributor.update({
        where: { id: contributor.id },
        data: {
          labels: {
            connect: projectInvite!.labelsId?.map((c) => ({ id: c })) || [],
          },
        },
      })

      // Get information for the notification
      const project = await db.project.findFirst({ where: { id: projectInvite!.projectId } })
      // Send notification
      await sendNotification(
        {
          templateId: "addedToProject",
          recipients: [contributor.userId],
          data: {
            projectName: project!.name,
            addedBy: projectInvite!.addedBy,
            privilege: getPrivilegeText(contributor.privilege),
          },
          projectId: contributor.projectId,
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
