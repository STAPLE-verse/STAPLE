import db from "db"
import { resolver } from "@blitzjs/rpc"
import { CreateNoteInput } from "src/notes/schemas"
import { NoteVisibility, MemberPrivileges } from "@prisma/client"

export default resolver.pipe(
  resolver.zod(CreateNoteInput),
  resolver.authorize(),
  async ({ projectId, ...data }, ctx) => {
    const userId = ctx.session.userId!

    const member = await db.projectMember.findFirst({
      where: {
        projectId,
        users: { some: { id: userId } },
      },
      select: { id: true },
    })
    if (!member) throw new Error("You are not a member of this project.")

    const privilegeRow = await db.projectPrivilege.findFirst({
      where: { projectId, userId },
      select: { privilege: true },
    })
    const isPM = privilegeRow?.privilege === MemberPrivileges.PROJECT_MANAGER

    const requestedVisibility =
      data.visibility === "SHARED"
        ? NoteVisibility.CONTRIBUTORS
        : (data.visibility as NoteVisibility | undefined)

    // Visibility guard: only PMs can create notes visible to all contributors
    if (requestedVisibility === NoteVisibility.CONTRIBUTORS && !isPM) {
      throw new Error("Only project managers can share notes with all contributors.")
    }

    const createData: any = { ...data }
    if (requestedVisibility !== undefined) {
      createData.visibility = requestedVisibility
    }

    return db.note.create({
      data: {
        projectId,
        authorId: member.id,
        ...createData,
      },
      select: { id: true, createdAt: true, updatedAt: true, visibility: true },
    })
  }
)
