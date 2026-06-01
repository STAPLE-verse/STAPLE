import { resolver } from "@blitzjs/rpc"
import { ArchiveFormSchema } from "../schemas"
import db from "db"

export default resolver.pipe(
  resolver.zod(ArchiveFormSchema),
  resolver.authorize(),
  async ({ formId, archived }) => {
    const nextArchived = archived ?? true

    await db.formVersion.updateMany({
      where: { formId },
      data: { archived: nextArchived },
    })

    return db.form.update({
      where: { id: formId },
      data: { archived: nextArchived },
    })
  }
)
