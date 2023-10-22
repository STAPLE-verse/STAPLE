import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteContributorSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteContributorSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const contributor = await db.contributor.deleteMany({ where: { id } })

    return contributor
  }
)
