import db from "db"
import { resolver } from "@blitzjs/rpc"
import { UpdateNoteInput } from "src/notes/schemas"
import { NoteVisibility, MemberPrivileges } from "@prisma/client"

export default resolver.pipe(
  resolver.zod(UpdateNoteInput),
  resolver.authorize(),
  async ({ id, ...data }, ctx) => {
    const userId = ctx.session.userId!

    // Load the note with author + project context
    const note = await db.note.findUnique({
      where: { id },
      select: {
        id: true,
        projectId: true,
        authorId: true,
        visibility: true,
        author: { select: { users: { select: { id: true } } } },
      },
    })
    if (!note) throw new Error("Note not found.")

    // Resolve the caller's project membership and role
    const member = await db.projectMember.findFirst({
      where: { projectId: note.projectId, users: { some: { id: userId } } },
      select: { id: true },
    })
    if (!member) throw new Error("You are not a member of this project.")

    const privilegeRow = await db.projectPrivilege.findFirst({
      where: { projectId: note.projectId, userId },
      select: { privilege: true },
    })

    const isAuthor = member.id === note.authorId
    const isPM = privilegeRow?.privilege === MemberPrivileges.PROJECT_MANAGER

    // ---- Permission: who can edit content at current visibility ----
    const canEditByVisibility = (() => {
      switch (note.visibility) {
        case NoteVisibility.PRIVATE:
          return isAuthor // only the author
        case NoteVisibility.PM_ONLY:
          return isPM || isAuthor // PMs or author
        case NoteVisibility.CONTRIBUTORS:
          return isPM // contributors are read-only even if they are the author
        default:
          return false
      }
    })()

    if (!canEditByVisibility) {
      throw new Error("You don't have permission to edit this note.")
    }

    // ---- Permission: validate requested visibility change (if any) ----
    if (data.visibility !== undefined && data.visibility !== note.visibility) {
      const next = data.visibility as NoteVisibility

      // Only PMs may set a note visible to all contributors
      if (next === NoteVisibility.CONTRIBUTORS && !isPM) {
        throw new Error("Only project managers can share notes with all contributors.")
      }

      // Only the author (or PMs) can make a note PRIVATE
      if (next === NoteVisibility.PRIVATE && !(isAuthor || isPM)) {
        throw new Error("Only the author or a project manager can make a note private.")
      }

      // PM_ONLY is allowed for PMs and for the author (even if author is a contributor)
      if (next === NoteVisibility.PM_ONLY && !(isPM || isAuthor)) {
        throw new Error("Only the author or a project manager can set PM-only visibility.")
      }
    }

    // Normalize legacy visibility value and coerce to Prisma enum type
    let updateData: any = { ...data }
    if (data.visibility !== undefined) {
      updateData.visibility =
        data.visibility === "SHARED"
          ? NoteVisibility.CONTRIBUTORS
          : (data.visibility as NoteVisibility)
    }

    return db.note.update({
      where: { id },
      data: updateData,
      select: { id: true, updatedAt: true, pinned: true, archived: true, visibility: true },
    })
  }
)
