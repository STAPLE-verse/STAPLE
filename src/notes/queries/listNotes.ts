import { resolver } from "@blitzjs/rpc"
import db from "db"
import { ListNotesInput } from "src/notes/schemas"
import { NoteVisibility, MemberPrivileges } from "@prisma/client"

export default resolver.pipe(
  resolver.zod(ListNotesInput),
  resolver.authorize(),
  async ({ projectId, includeArchived }, ctx) => {
    const userId = ctx.session.userId!
    const member = await db.projectMember.findFirst({
      where: {
        projectId,
        users: {
          some: { id: userId },
        },
      },
      select: { id: true },
    })
    if (!member) throw new Error("You are not a member of this project.")

    const privilegeRow = await db.projectPrivilege.findFirst({
      where: { projectId, userId },
      select: { privilege: true },
    })
    const isPM = privilegeRow?.privilege === MemberPrivileges.PROJECT_MANAGER

    const notes = await db.note.findMany({
      where: {
        projectId,
        archived: includeArchived ? undefined : false,
        OR: [
          // Private: only author
          { visibility: NoteVisibility.PRIVATE, authorId: member.id },
          // PM_ONLY: PMs see all; contributors only see their own
          ...(isPM
            ? [{ visibility: NoteVisibility.PM_ONLY }]
            : [{ visibility: NoteVisibility.PM_ONLY, authorId: member.id }]),
          // CONTRIBUTORS: all project members can view
          { visibility: NoteVisibility.CONTRIBUTORS },
        ],
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
        authorId: true,
      },
    })

    return notes.map((r) => ({
      ...r,
      canSetContributors: isPM,
      editable:
        r.authorId === member.id ||
        (isPM &&
          (r.visibility === NoteVisibility.PM_ONLY ||
            r.visibility === NoteVisibility.CONTRIBUTORS)),
    }))
  }
)
