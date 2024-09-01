import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateElementSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateElementSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    const element = await db.element.update({ where: { id }, data })

    return element
  }
)
