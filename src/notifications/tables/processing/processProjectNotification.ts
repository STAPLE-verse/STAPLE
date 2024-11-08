import { stripHtmlTags } from "src/notifications/utils/stripHtmlTags"
import { ExtendedNotification } from "./processNotification"

export type ProjectNotificationData = {
  createdAt: Date
  cleanMessage: string
  rawMessage: string
  notification: ExtendedNotification
}

export function processProjectNotification(
  notifications: ExtendedNotification[]
): ProjectNotificationData[] {
  return notifications.map((notification) => {
    const cleanMessage = stripHtmlTags(notification.message || "")

    return {
      createdAt: notification.createdAt,
      cleanMessage: cleanMessage,
      rawMessage: notification.message || "",
      notification: notification,
    }
  })
}
