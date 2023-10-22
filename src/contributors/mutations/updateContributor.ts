import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateContributorSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateContributorSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const contributor = await db.contributor.update({ where: { id }, data })

    return contributor
  }
)
