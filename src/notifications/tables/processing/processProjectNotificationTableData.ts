import { stripHtmlTags } from "src/core/utils/stripHtmlTags"
import { ExtendedNotification } from "./processNotificationTableData"

export type ProjectNotificationTableData = {
  createdAt: Date
  cleanMessage: string
  rawMessage: string
  notification: ExtendedNotification
}

export function processProjectNotificationTableData(
  notifications: ExtendedNotification[]
): ProjectNotificationTableData[] {
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
