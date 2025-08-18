import { resolver } from "@blitzjs/rpc"
import db from "db"
import { ListNotesInput } from "src/notes/schemas"

export default resolver.pipe(
  resolver.zod(ListNotesInput),
  resolver.authorize(),
  async ({ projectId, includeArchived }, ctx) => {
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

    return db.note.findMany({
      where: {
        projectId,
        authorId: pm.id,
        archived: includeArchived ? undefined : false,
      },
      orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
      select: {
        id: true,
        title: true,
        contentMarkdown: true,
        contentJSON: true,
        pinned: true,
        archived: true,
        visibility: true,
        updatedAt: true,
        createdAt: true,
      },
    })
  }
)
