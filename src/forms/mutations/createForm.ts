import { resolver } from "@blitzjs/rpc"
import { CreateFormSchema } from "../schemas"
import db from "db"

export default resolver.pipe(
  resolver.zod(CreateFormSchema),
  resolver.authorize(),
  async ({ userId, schema, uiSchema }) => {
    const form = await db.forms.create({
      data: {
        schema,
        uiSchema,
        user: {
          connect: { id: userId },
        },
      },
    })

    return form
  }
)
