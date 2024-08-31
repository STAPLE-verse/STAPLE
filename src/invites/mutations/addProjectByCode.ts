import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import db from "db"
import sendNotification from "src/notifications/mutations/sendNotification"

// just need the code
const addProjectByCodeSchema = z.object({
  invitationCode: z.string(),
  userId: z.number(),
})

export default resolver.pipe(
  resolver.zod(addProjectByCodeSchema),
  resolver.authorize(),
  async ({ invitationCode, userId }) => {
    // get the invitation information
    const projectInvite = await db.invitation.findFirst({
      where: {
        invitationCode: invitationCode,
      },
    })

    // accept so write to project contributor table
    const contributor = await db.contributor.create({
      data: {
        userId: userId,
        privilege: projectInvite?.privilege,
        labels: projectInvite?.labels,
        projectId: projectInvite?.projectId,
      },
    })

    // send notification
    await sendNotification(
      {
        templateId: "changedAssignment",
        recipients: userIds,
        data: {
          taskName: assignment!.task.name,
          completedBy: completedByUsername,
          assignmentStatus: getAssignmentStatusText(status),
        },
        projectId: assignment?.task["projectId"],
      },
      ctx
    )

    // deleting invitations

    return contributor
  }
)
