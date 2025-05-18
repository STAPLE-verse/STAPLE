import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const markAsRead = z.object({
  commentIds: z.array(z.number()),
  projectMemberId: z.number(),
})

export default resolver.pipe(
  resolver.zod(markAsRead),
  async ({ commentIds, projectMemberId }, ctx) => {
    await Promise.all(
      commentIds.map((commentId) =>
        db.commentReadStatus.upsert({
          where: {
            commentId_projectMemberId: {
              commentId,
              projectMemberId,
            },
          },
          update: {
            read: true,
          },
          create: {
            commentId,
            projectMemberId,
            read: true,
          },
        })
      )
    )
    return true
  }
)
