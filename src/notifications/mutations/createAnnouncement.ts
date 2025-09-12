import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import db from "db"

const createAnnouncementSchema = z.object({
  announcementText: z.string(),
  projectId: z.number(),
  projectMembersId: z.array(z.number()).optional(),
  teamsId: z.array(z.number()).optional(),
})

export default resolver.pipe(
  resolver.zod(createAnnouncementSchema),
  resolver.authorize(),
  async ({ announcementText, projectId, projectMembersId = [], teamsId = [] }) => {
    const selectedIds = [...projectMembersId, ...teamsId]
    let finalRecipients: number[] = []

    if (selectedIds.length === 0) {
      const allProjectMembers = await db.projectMember.findMany({
        where: { projectId, deleted: false },
        include: { users: true },
      })
      finalRecipients = allProjectMembers.flatMap((pm) => pm.users.map((u) => u.id))
    } else {
      const selectedMembers = await db.projectMember.findMany({
        where: { id: { in: selectedIds }, deleted: false },
        include: { users: true },
      })
      finalRecipients = selectedMembers.flatMap((pm) => pm.users.map((u) => u.id))
    }

    const uniqueUserIds = [...new Set(finalRecipients)]

    const announcement = await db.notification.create({
      data: {
        message: announcementText,
        recipients: {
          connect: uniqueUserIds.map((id) => ({ id })),
        },
        announcement: true,
        projectId,
      },
    })

    return announcement
  }
)
