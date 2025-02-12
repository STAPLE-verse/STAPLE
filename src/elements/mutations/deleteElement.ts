import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteElementSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteElementSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const element = await db.element.deleteMany({ where: { id } })

    return element
  }
)
