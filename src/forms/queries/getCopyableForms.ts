import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetCopyableFormsSchema = z.object({
  // the form being edited; copying from it is what the duplicate button is for
  excludeFormId: z.number().optional(),
})

// The signed-in user's own STAPLE forms, for "copy items from another form" in the builder
export default resolver.pipe(
  resolver.zod(GetCopyableFormsSchema),
  resolver.authorize(),
  async ({ excludeFormId }, ctx) => {
    const userId = ctx.session.userId as number
    const forms = await db.form.findMany({
      where: {
        userId,
        archived: false,
        app: "staple",
        ...(excludeFormId !== undefined ? { id: { not: excludeFormId } } : {}),
      },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        versions: {
          where: { archived: false },
          orderBy: { version: "desc" },
          take: 1,
          select: { name: true, version: true },
        },
      },
    })

    return forms.flatMap((form) => {
      const latest = form.versions[0]
      return latest ? [{ id: form.id, title: latest.name, description: `v${latest.version}` }] : []
    })
  }
)
