import { Project, Notification } from "db"
import { stripHtmlTags } from "src/notifications/utils/stripHtmlTags"

// Type for notifications with project included
export type ExtendedNotification = Notification & {
  project: Project
}

export type NotificationTableData = {
  projectName: string
  createdAt: Date
  cleanMessage: string
  rawMessage: string
  notification: ExtendedNotification
}

export function processNotificationTableData(
  notifications: ExtendedNotification[]
): NotificationTableData[] {
  return notifications.map((notification) => {
    const cleanMessage = stripHtmlTags(notification.message || "")

    return {
      projectName: notification.project ? notification.project.name.substring(0, 20) : "",
      createdAt: notification.createdAt,
      cleanMessage: cleanMessage,
      rawMessage: notification.message || "",
      notification: notification,
    }
  })
}
