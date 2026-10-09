import db from "db"
import { resolver } from "@blitzjs/rpc"
import { z } from "zod"

import { requireProjectMember } from "src/projectprivileges/utils/requireAccess"
const GetUserProjectMemberIds = z.object({
  projectId: z.number(),
  userId: z.number(),
})

export default resolver.pipe(
  resolver.zod(GetUserProjectMemberIds),
  resolver.authorize(),
  async ({ projectId, userId }, ctx) => {
    await requireProjectMember(ctx, projectId)
    const members = await db.projectMember.findMany({
      where: {
        projectId,
        users: {
          some: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
      },
    })

    return members.map((m) => m.id)
  }
)
