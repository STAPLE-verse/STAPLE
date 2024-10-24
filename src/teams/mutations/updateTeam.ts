import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateTeamSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateTeamSchema),
  resolver.authorize(),
  async ({ id, name, userIds }) => {
    const team = await db.projectMember.update({
      where: { id },
      data: {
        name: name,
        users: {
          set: userIds.map((userId) => ({
            id: userId,
          })),
        },
      },
      include: {
        users: true, // Include the users relation in the result
      },
    })

    return team
  }
)
