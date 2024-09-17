import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import db from "db"

const createAnnouncementSchema = z.object({
  announcementText: z.string(),
  projectId: z.number(),
})

export default resolver.pipe(
  resolver.zod(createAnnouncementSchema),
  resolver.authorize(),
  async ({ announcementText, projectId }) => {
    // Get all projectMembers for the project
    const projectMembers = await db.projectMember.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        user: true,
      },
    })

    // Get userIds
    const userIds = projectMembers.map((projectMember) => projectMember.user.id)

    // Create notification
    const annoucement = await db.notification.create({
      data: {
        message: announcementText,
        recipients: {
          connect: userIds.map((id) => ({ id })),
        },
        announcement: true,
        projectId: projectId,
      },
    })

    return annoucement
  }
)
