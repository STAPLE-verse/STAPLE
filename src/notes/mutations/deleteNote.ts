import db from "db"
import { resolver } from "@blitzjs/rpc"
import { z } from "zod"

const DeleteNoteInput = z.object({ id: z.number().int().positive() })

export default resolver.pipe(
  resolver.zod(DeleteNoteInput),
  resolver.authorize(),
  async ({ id }, ctx) => {
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
      data: { archived: true, pinned: false },
      select: { id: true, archived: true },
    })
  }
)
