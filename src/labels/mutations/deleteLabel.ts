import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteLabelSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteLabelSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const label = await db.contributorLabel.deleteMany({ where: { id } })

    return label
  }
)
