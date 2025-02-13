import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const DeleteNotificationSchema = z.object({
  ids: z.array(z.number()), // Expecting an array of IDs
})

export default resolver.pipe(
  resolver.zod(DeleteNotificationSchema),
  resolver.authorize(),
  async ({ ids }) => {
    await db.notification.deleteMany({
      where: {
        id: { in: ids },
      },
    })
    return { success: true }
  }
)
