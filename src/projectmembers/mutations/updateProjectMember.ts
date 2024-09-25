import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateProjectMemberSchema } from "../schemas"

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
  async ({ id, rolesId = [], ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const projectMember = await db.projectMember.update({ where: { id }, data })

    await connectRoles(id, rolesId)

    return projectMember
  }
)
