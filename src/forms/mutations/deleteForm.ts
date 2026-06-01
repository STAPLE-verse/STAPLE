import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const DeleteFormSchema = z.object({
  formId: z.coerce.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteFormSchema),
  resolver.authorize(),
  async ({ formId }) => {
    const versions = await db.formVersion.findMany({
      where: { formId },
      select: {
        id: true,
        tasks: { select: { id: true } },
        projects: { select: { id: true } },
      },
    })

    let anyDeployed = false

    for (const version of versions) {
      const isDeployed = version.tasks.length > 0 || version.projects.length > 0
      if (isDeployed) {
        await db.formVersion.update({ where: { id: version.id }, data: { archived: true } })
        anyDeployed = true
      } else {
        await db.formVersion.delete({ where: { id: version.id } })
      }
    }

    if (anyDeployed) {
      return db.form.update({ where: { id: formId }, data: { archived: true } })
    }

    return db.form.delete({ where: { id: formId } })
  }
)
