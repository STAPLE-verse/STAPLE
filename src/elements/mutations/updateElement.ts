import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateElementSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateElementSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const element = await db.element.update({ where: { id }, data })

    return element
  }
)
