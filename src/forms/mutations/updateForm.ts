import { resolver } from "@blitzjs/rpc"
import db from "db"
import { EditFormSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(EditFormSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    const forms = await db.forms.update({ where: { id }, data })

    return forms
  }
)
