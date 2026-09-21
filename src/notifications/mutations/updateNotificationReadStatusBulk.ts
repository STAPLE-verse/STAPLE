import { Ctx } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { z } from "zod"

const updateAllSchema = z.object({
  where: z.custom<Prisma.NotificationWhereInput>((value) => typeof value === "object"),
  read: z.boolean(),
})

export default resolver.pipe(
  resolver.zod(updateAllSchema),
  resolver.authorize(),
  async ({ where, read }, ctx: Ctx) => {
    // See getNotifications.ts — the caller's `where` is an additional filter
    // only; without this, any authenticated user could pass `where: {}` and
    // flip every notification in the system.
    await db.notification.updateMany({
      where: {
        AND: [
          { recipients: { some: { id: ctx.session.userId as number } }, source: "STAPLE" },
          where,
        ],
      },
      data: { read },
    })
    return { success: true }
  }
)
