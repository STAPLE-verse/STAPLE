import { Ctx } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { z } from "zod"

const DeleteNotificationSchema = z
  .object({
    ids: z.array(z.number()).optional(),
    selectAll: z.boolean().optional(),
    where: z.custom<Prisma.NotificationWhereInput>((value) => typeof value === "object").optional(),
  })
  .refine(
    (data) => {
      if (data.selectAll) {
        return Boolean(data.where)
      }
      return Array.isArray(data.ids) && data.ids.length > 0
    },
    {
      message: "Provide either ids to delete or set selectAll with a where clause.",
    }
  )

type DeleteNotificationInput = z.infer<typeof DeleteNotificationSchema>

export default resolver.pipe(
  resolver.zod(DeleteNotificationSchema),
  resolver.authorize(),
  async (input: DeleteNotificationInput, ctx: Ctx) => {
    // Both branches previously deleted by a caller-supplied `where`/`ids`
    // with no ownership check at all — any authenticated user could delete
    // any notification, or (via selectAll with where: {}) every notification
    // in the system. Recipient + source scoping is enforced here, never
    // trusted from the caller.
    const ownershipScope = {
      recipients: { some: { id: ctx.session.userId as number } },
      source: "STAPLE" as const,
    }

    if (input.selectAll) {
      await db.notification.deleteMany({
        where: { AND: [ownershipScope, input.where!] },
      })
      return { success: true }
    }

    await db.notification.deleteMany({
      where: {
        id: { in: input.ids! },
        ...ownershipScope,
      },
    })
    return { success: true }
  }
)
