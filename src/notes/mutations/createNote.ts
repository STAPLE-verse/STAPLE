import db from "db"
import { resolver } from "@blitzjs/rpc"
import { CreateNoteInput } from "src/notes/schemas"

export default resolver.pipe(
  resolver.zod(CreateNoteInput),
  resolver.authorize(),
  async ({ projectId, ...data }, ctx) => {
    const userId = ctx.session.userId!
    const pm = await db.projectMember.findFirst({
      where: {
        projectId,
        users: {
          some: { id: userId },
        },
      },
      select: { id: true },
    })
    if (!pm) throw new Error("You are not a member of this project.")

    return db.note.create({
      data: {
        projectId,
        authorId: pm.id,
        ...data,
      },
      select: { id: true, createdAt: true, updatedAt: true },
    })
  }
)
