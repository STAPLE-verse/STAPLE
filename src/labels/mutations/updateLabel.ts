import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateLabelSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateLabelSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const label = await db.contributorLabel.update({ where: { id }, data })

    return label
  }
)
