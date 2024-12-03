import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteTeamSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteTeamSchema),
  resolver.authorize(),
  async ({ id }) => {
    const team = await db.projectMember.update({ where: { id }, data: { deleted: true } })

    return team
  }
)
