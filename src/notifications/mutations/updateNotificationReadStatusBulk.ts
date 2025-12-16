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
  async ({ where, read }) => {
    await db.notification.updateMany({
      where,
      data: { read },
    })
    return { success: true }
  }
)
