import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateTeamSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateTeamSchema),
  resolver.authorize(),
  async ({ id, name, userIds }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const team = await db.projectMember.update({
      where: { id },
      data: {
        name: name,
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
