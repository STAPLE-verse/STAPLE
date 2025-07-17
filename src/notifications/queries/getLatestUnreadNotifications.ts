import { Ctx } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { determineNotificationType } from "../utils/determineNotificationType"

interface GetLatestUnreadNotificationsInput {
  projectId?: number
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ projectId }: GetLatestUnreadNotificationsInput, ctx: Ctx) => {
    const whereClause = {
      recipients: {
        some: {
          id: ctx.session.userId as number,
        },
      },
      read: false,
      ...(projectId && { projectId }), // Filter only for project if projectId is provided
    }

    const notifications = await db.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" }, // Use a timestamp field to get the latest notifications
    })

    const countsByType: { [key: string]: number } = {}

    notifications.forEach((n) => {
      const type = determineNotificationType(n.message)
      countsByType[type] = (countsByType[type] || 0) + 1
    })

    const topThree = notifications.slice(0, 3)

    return {
      notifications: topThree,
      countsByType,
    }
  }
)
