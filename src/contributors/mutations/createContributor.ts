import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateContributorSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateContributorSchema),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const contributor = await db.contributor.create({ data: input })

    return contributor
  }
)
