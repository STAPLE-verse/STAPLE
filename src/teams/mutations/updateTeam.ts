import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateTeamSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateTeamSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const team = await db.team.update({
      where: { id },
      data: {
        name: data.name,
        contributors: {
          set: data.contributors.map((id) => ({ id })),
        },
      },
    })

    return team
  }
)
