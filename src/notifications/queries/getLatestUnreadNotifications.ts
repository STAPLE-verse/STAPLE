import { Ctx } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"

interface GetLatestUnreadNotificationsInput {
  projectId?: number
}

function determineNotificationType(message: string): string {
  const msg = message.toLowerCase()
  if (msg.includes("assigned")) return "Task"
  if (msg.includes("comment")) return "Comment"
  if (msg.includes("project")) return "Project"
  if (msg.includes("assignment")) return "Task"
  return "Other"
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
