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
        users: true,
      },
    })

    // Get userIds
    const userIds = projectMembers
      .flatMap((pm) => pm.users.map((user) => user.id)) // Flatten the nested arrays and extract IDs
      .filter((id) => id !== undefined) // Optionally filter out any undefined values

    // Step 3: Remove duplicates (if needed)
    const uniqueUserIds = [...new Set(userIds)]

    // Create notification
    const annoucement = await db.notification.create({
      data: {
        message: announcementText,
        recipients: {
          connect: uniqueUserIds.map((id) => ({ id })),
        },
        announcement: true,
        projectId: projectId,
      },
    })

    return annoucement
  }
)
