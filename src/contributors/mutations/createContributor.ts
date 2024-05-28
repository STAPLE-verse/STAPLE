import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateContributorSchema } from "../schemas"
import sendNotification from "src/messages/mutations/sendNotification"
import { getPrivilegeText } from "src/services/getPrivilegeText"

export default resolver.pipe(
  resolver.zod(CreateContributorSchema),
  resolver.authorize(),
  async (input, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const contributor = await db.contributor.create({
      data: {
        userId: input.userId,
        projectId: input.projectId,
        privilege: input.privilege,
        // project: {
        //   connect: { id: input.projectId },
        // },
        // user: {
        //   // TODO: replace this later with actual logic
        //   connect: { id: input.userId },
        // },
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
