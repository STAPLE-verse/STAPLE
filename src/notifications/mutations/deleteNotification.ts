import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteNotificationSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteNotificationSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const notification = await db.notification.deleteMany({ where: { id } })

    return notification
  }
)
