import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateProjectMemberRoleSchema } from "../schemas"

import { requireManagerOf } from "src/projectprivileges/utils/requireAccess"
async function updateProjectMember(id, rolesId, disconnect) {
  let r
  await db.$transaction(async (prisma) => {
    if (disconnect) {
      const c = await db.projectMember.update({
        where: { id: id },
        data: {
          roles: {
            set: [],
          },
        },
      })
    }

    r = db.projectMember.update({
      where: { id: id },
      data: {
        roles: {
          connect: rolesId?.map((c) => ({ id: c })) || [],
        },
      },
    })
  })
  return r
}

export default resolver.pipe(
  resolver.zod(UpdateProjectMemberRoleSchema),
  resolver.authorize(),
  async ({ projectMembersId, rolesId = [], disconnect, ...data }, ctx) => {
    await requireManagerOf(ctx, "projectMember", projectMembersId)
    let c = null
    projectMembersId.forEach(async (id) => {
      c = await updateProjectMember(id, rolesId, disconnect)
    })

    // return task
    return c
  }
)
