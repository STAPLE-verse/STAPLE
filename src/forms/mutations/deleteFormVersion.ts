import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const DeleteFormVersionSchema = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteFormVersionSchema),
  resolver.authorize(),
  async ({ id }) => {
    const version = await db.formVersion.findUnique({
      where: { id },
      select: {
        id: true,
        formId: true,
        version: true,
        tasks: { select: { id: true } },
        projects: { select: { id: true } },
      },
    })

    if (!version) {
      throw new Error("Form version not found.")
    }

    const latestVersion = await db.formVersion.findFirst({
      where: { formId: version.formId },
      orderBy: { version: "desc" },
      select: { id: true },
    })

    if (latestVersion?.id === version.id) {
      throw new Error("The current form version cannot be deleted.")
    }

    if (version.tasks.length > 0 || version.projects.length > 0) {
      throw new Error("This version is in use and cannot be deleted.")
    }

    return db.formVersion.delete({
      where: { id: version.id },
    })
  }
)
