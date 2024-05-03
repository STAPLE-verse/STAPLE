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
  async ({ id, read }) => {
    // Update notification data
    const notification = await db.notification.update({ where: { id }, data: { read: read } })

    return notification
  }
)
