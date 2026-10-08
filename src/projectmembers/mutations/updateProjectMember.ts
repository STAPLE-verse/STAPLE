import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateProjectMemberSchema } from "../schemas"

import { requireManagerOfMemberUser } from "src/projectprivileges/utils/requireAccess"
async function connectRoles(projectMemberId, rolesId) {
  await db.$transaction(async (prisma) => {
    await db.projectMember.update({
      where: { id: projectMemberId },
      data: {
        roles: {
          set: [],
        },
      },
    })

    await db.projectMember.update({
      where: { id: projectMemberId },
      data: {
        roles: {
          connect: rolesId?.map((c) => ({ id: c })) || [],
        },
      },
    })
  })
}

export default resolver.pipe(
  resolver.zod(UpdateProjectMemberSchema),
  resolver.authorize(),
  async ({ id, rolesId = [], privilege, projectId, userId, ...data }, ctx) => {
    await requireManagerOfMemberUser(ctx, id, projectId, userId)
    const projectMember = await db.projectMember.update({
      where: { id },
      data: {
        ...data,
        tags: data.tags ?? undefined,
      },
    })

    await connectRoles(id, rolesId)

    // Update the privilege in the ProjectPrivilege table
    if (privilege) {
      await db.projectPrivilege.updateMany({
        where: {
          userId: userId,
          projectId: projectId,
        },
        data: {
          privilege, // Update the privilege to the new value
        },
      })
    }

    return projectMember
  }
)
