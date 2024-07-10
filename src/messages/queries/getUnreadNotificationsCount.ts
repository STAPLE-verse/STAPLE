import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetUnreadNotificationsCountInput extends Pick<Prisma.NotificationFindManyArgs, "where"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where }: GetUnreadNotificationsCountInput) => {
    const totalCount = await db.notification.count({
      where,
    })

    const unreadCount = await db.notification.count({
      where: {
        ...where,
        read: false,
      },
    })

    return {
      totalCount,
      unreadCount,
    }
  }
)
