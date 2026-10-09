import { resolver } from "@blitzjs/rpc"
import { ArchiveFormSchema } from "../schemas"
import db from "db"

import { requireFormOwner } from "src/projectprivileges/utils/requireAccess"
export default resolver.pipe(
  resolver.zod(ArchiveFormSchema),
  resolver.authorize(),
  async ({ formId, archived }, ctx) => {
    await requireFormOwner(ctx, [formId])
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
