import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateTeamSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateTeamSchema),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const team = await db.team.create({ data: input })

    return team
  }
)
