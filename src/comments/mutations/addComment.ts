import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const AddCommentSchema = z.object({
  taskLogId: z.number(),
  projectMemberId: z.number(),
  content: z.string().min(1, "Comment cannot be empty"),
})

export default resolver.pipe(
  resolver.zod(AddCommentSchema),
  resolver.authorize(),
  async ({ taskLogId, projectMemberId, content }, ctx) => {
    const userId = ctx.session.userId
    if (!userId) throw new Error("User not authenticated")

    // Create a new comment
    const comment = await db.comment.create({
      data: {
        taskLogId,
        authorId: projectMemberId,
        content,
      },
      include: {
        author: true,
      },
    })

    return comment
  }
)
