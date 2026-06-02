import { resolver } from "@blitzjs/rpc"
import { ArchiveFormSchema } from "../schemas"
import db from "db"

export default resolver.pipe(
  resolver.zod(ArchiveFormSchema),
  resolver.authorize(),
  async ({ formId, archived }) => {
    await db.formVersion.updateMany({
      where: { formId },
      data: { archived },
    })

    return db.form.update({
      where: { id: formId },
      data: { archived },
    })
  }
)
