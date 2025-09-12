import db from "db"
import { resolver } from "@blitzjs/rpc"
import { z } from "zod"

const GetUserProjectMemberIds = z.object({
  projectId: z.number(),
  userId: z.number(),
})

export default resolver.pipe(
  resolver.zod(GetUserProjectMemberIds),
  resolver.authorize(),
  async ({ projectId, userId }) => {
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
