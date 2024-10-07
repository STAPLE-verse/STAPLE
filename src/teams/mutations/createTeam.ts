import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateTeamSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateTeamSchema),
  resolver.authorize(),
  async ({ projectId, name, userIds }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const team = await db.projectMember.create({
      data: {
        name,
        project: {
          connect: { id: projectId },
        },
        users: {
          connect: userIds.map((userId) => ({
            id: userId,
          })),
        },
      },
    })

    return team
  }
)
