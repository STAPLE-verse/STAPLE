import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateLabelSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateLabelSchema),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant

    const label = await db.label.create({ data: input })

    return label
  }
)
