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
  async (input: DeleteNotificationInput) => {
    if (input.selectAll) {
      await db.notification.deleteMany({
        where: input.where!,
      })
      return { success: true }
    }

    await db.notification.deleteMany({
      where: {
        id: { in: input.ids! },
      },
    })
    return { success: true }
  }
)
