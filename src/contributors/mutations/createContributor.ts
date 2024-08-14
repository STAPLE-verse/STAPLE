import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateContributorSchema } from "../schemas"
import sendNotification from "src/notifications/mutations/sendNotification"
import { getPrivilegeText } from "src/services/getPrivilegeText"

export default resolver.pipe(
  resolver.zod(CreateContributorSchema),
  resolver.authorize(),
  async (input, ctx) => {
    // Create contributor
    const contributor = await db.contributor.create({
      data: {
        userId: input.userId,
        projectId: input.projectId,
        privilege: input.privilege,
      },
    })

    // Send notification
    // Get information for the notification
    const project = await db.project.findFirst({ where: { id: input.projectId } })
    await sendNotification(
      {
        templateId: "addedToProject",
        recipients: [input.userId],
        data: {
          projectName: project!.name,
          addedBy: input.addedBy,
          privilege: getPrivilegeText(input.privilege),
        },
        projectId: input.projectId,
      },
      ctx
    )

    return contributor
  }
)
