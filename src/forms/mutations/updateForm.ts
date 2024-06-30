import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { EditFormSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(EditFormSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    const newSchema = data.schema != null ? data.schema : Prisma.JsonNull
    const forms = await db.forms.update({
      where: { id },
      data: {
        uiSchema: data.uiSchema,
        schema: newSchema,
      },
    })

    return forms
  }
)
