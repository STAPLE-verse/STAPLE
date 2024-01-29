import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateTeamSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateTeamSchema),
  resolver.authorize(),
  async ({ projectId, name, contributors }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const team = await db.team.create({
      data: {
        name,
        project: {
          connect: { id: projectId },
        },

        contributors: {
          connect: contributors.map((val) => ({
            id: val,
          })),
        },
      },
    })

    return team
  }
)
