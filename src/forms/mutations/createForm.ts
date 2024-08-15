import { resolver } from "@blitzjs/rpc"
import { CreateFormSchema } from "../schemas"
import db, { Prisma } from "db"

export default resolver.pipe(
  resolver.zod(CreateFormSchema),
  resolver.authorize(),
  async ({ userId, schema, uiSchema }) => {
    const newSchema = schema != null ? schema : Prisma.JsonNull
    const form = await db.forms.create({
      data: {
        schema: newSchema,
        uiSchema,
        user: {
          connect: { id: userId },
        },
      },
    })

    return form
  }
)
