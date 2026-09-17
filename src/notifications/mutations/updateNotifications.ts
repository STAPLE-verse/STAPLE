import { NotFoundError, Ctx } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const updateNotificationSchema = z.object({
  id: z.number(),
  read: z.boolean(),
})

export default resolver.pipe(
  resolver.zod(updateNotificationSchema),
  resolver.authorize(),
  async ({ id, read }, ctx: Ctx) => {
    // Scoped to the caller's own recipient rows — previously this updated
    // any notification by id with no ownership check at all.
    const result = await db.notification.updateMany({
      where: {
        id,
        recipients: { some: { id: ctx.session.userId as number } },
        source: "STAPLE",
      },
      data: { read },
    })

    if (result.count === 0) {
      throw new NotFoundError()
    }

    return { success: true }
  }
)
