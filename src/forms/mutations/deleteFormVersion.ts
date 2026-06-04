import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

type DeleteFormVersionResult =
  | { action: "deleted" }
  | {
      action: "archived"
      id: number
    }

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
        archived: true,
        tasks: { select: { id: true } },
        projects: { select: { id: true } },
      },
    })

    if (!version) {
      throw new Error("Form version not found.")
    }

    const versionCount = await db.formVersion.count({
      where: { formId: version.formId },
    })

    if (version.tasks.length > 0 || version.projects.length > 0) {
      await db.formVersion.update({
        where: { id: version.id },
        data: { archived: true },
      })
      return { action: "archived", id: version.id } satisfies DeleteFormVersionResult
    }

    if (versionCount === 1) {
      await db.formVersion.update({
        where: { id: version.id },
        data: { archived: true },
      })
      return { action: "archived", id: version.id } satisfies DeleteFormVersionResult
    }

    await db.formVersion.delete({
      where: { id: version.id },
    })
    return { action: "deleted" } satisfies DeleteFormVersionResult
  }
)
