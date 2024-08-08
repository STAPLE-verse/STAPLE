import { Ctx } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"

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
      take: 3,
    })

    return {
      notifications,
    }
  }
)
