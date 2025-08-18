import db from "db"
import { resolver } from "@blitzjs/rpc"
import { UpdateNoteInput } from "src/notes/schemas"

export default resolver.pipe(
  resolver.zod(UpdateNoteInput),
  resolver.authorize(),
  async ({ id, ...data }, ctx) => {
    const userId = ctx.session.userId!
    const note = await db.note.findUnique({
      where: { id },
      select: {
        author: {
          select: {
            users: { select: { id: true } },
          },
        },
      },
    })
    if (!note) throw new Error("Note not found.")
    const isAuthor = note.author.users.some((u) => u.id === userId)
    if (!isAuthor) throw new Error("Not your note.")

    return db.note.update({
      where: { id },
      data,
      select: { id: true, updatedAt: true, pinned: true, archived: true },
    })
  }
)
