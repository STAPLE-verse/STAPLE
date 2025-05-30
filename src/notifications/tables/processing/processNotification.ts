import { Project, Notification } from "db"
import { RouteData } from "src/core/types"
import { stripHtmlTags } from "src/notifications/utils/stripHtmlTags"

// Type for notifications with project included
export type ExtendedNotification = Notification & {
  project: Project
}

export type NotificationTableData = {
  id: number
  projectName: string
  createdAt: Date
  cleanMessage: string
  rawMessage: string
  notification: ExtendedNotification
  routeData: RouteData | null
  type: string
}

export function processNotification(
  notifications: ExtendedNotification[]
): NotificationTableData[] {
  function determineNotificationType(message: string): string {
    const msg = message.toLowerCase()
    if (msg.includes("assigned")) return "Task"
    if (msg.includes("comment")) return "Comment"
    if (msg.includes("project")) return "Project"
    if (msg.includes("assignment")) return "Task"
    return "Other"
  }

  return notifications.map((notification) => {
    const cleanMessage = stripHtmlTags(notification.message || "")

    return {
      id: notification.id,
      projectName: notification.project ? notification.project.name.substring(0, 20) : "",
      createdAt: notification.createdAt,
      cleanMessage: cleanMessage,
      rawMessage: notification.message || "",
      notification: notification,
      routeData: notification.routeData as RouteData,
      type: determineNotificationType(cleanMessage),
    }
  })
}
