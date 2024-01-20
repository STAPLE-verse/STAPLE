import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteTeamSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteTeamSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const team = await db.team.deleteMany({ where: { id } })

    return team
  }
)
