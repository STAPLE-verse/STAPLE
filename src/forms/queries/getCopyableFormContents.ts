import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetCopyableFormContentsSchema = z.object({
  id: z.number(),
})

// The latest schema of one of the signed-in user's own STAPLE forms. Anyone else's form
// is reported as not found, so ids can't be probed.
export default resolver.pipe(
  resolver.zod(GetCopyableFormContentsSchema),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const userId = ctx.session.userId as number
    const form = await db.form.findFirst({
      where: { id, userId, archived: false, app: "staple" },
      select: {
        versions: {
          where: { archived: false },
          orderBy: { version: "desc" },
          take: 1,
          select: { schema: true, uiSchema: true },
        },
      },
    })

    const latest = form?.versions[0]
    if (!latest) throw new NotFoundError()

    return { schema: latest.schema, uiSchema: latest.uiSchema }
  }
)
