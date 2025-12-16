import { Project, Notification } from "db"
import { RouteData } from "src/core/types"
import { determineNotificationType } from "src/notifications/utils/determineNotificationType"
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
  isMarkdown: boolean
}

export function processNotification(
  notifications: ExtendedNotification[]
): NotificationTableData[] {
  return notifications.map((notification) => {
    const cleanMessage = stripHtmlTags(notification.message || "")
    const type = determineNotificationType(cleanMessage)
    const containsHtml = /<\/?[a-z][\s\S]*>/i.test(notification.message || "")
    const isMarkdown = type === "Project" && !containsHtml

    return {
      id: notification.id,
      projectName: notification.project ? notification.project.name.substring(0, 20) : "",
      createdAt: notification.createdAt,
      cleanMessage: cleanMessage,
      rawMessage: notification.message || "",
      notification: notification,
      routeData: notification.routeData as RouteData,
      type,
      isMarkdown,
    }
  })
}
