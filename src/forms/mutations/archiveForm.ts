import { resolver } from "@blitzjs/rpc"
import { ArchiveFormSchema } from "../schemas"
import db from "db"

export default resolver.pipe(
  resolver.zod(ArchiveFormSchema),
  resolver.authorize(),
  async ({ formId }) => {
    const form = await db.forms.update({
      where: { id: formId },
      data: { archived: true },
    })

    return form
  }
)
