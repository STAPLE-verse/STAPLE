import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { z } from "zod"

const deleteByIdsSchema = z.object({
  ids: z.array(z.number()).min(1),
})

const deleteAllSchema = z.object({
  selectAll: z.literal(true),
  where: z.custom<Prisma.NotificationWhereInput>((value) => typeof value === "object"),
})

const DeleteNotificationSchema = z.union([deleteByIdsSchema, deleteAllSchema])

export default resolver.pipe(
  resolver.zod(DeleteNotificationSchema),
  resolver.authorize(),
  async (input) => {
    if ("selectAll" in input) {
      await db.notification.deleteMany({
        where: input.where,
      })
      return { success: true }
    }

    await db.notification.deleteMany({
      where: {
        id: { in: input.ids },
      },
    })
    return { success: true }
  }
)
