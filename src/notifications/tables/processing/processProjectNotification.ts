import { stripHtmlTags } from "src/notifications/utils/stripHtmlTags"
import { ExtendedNotification } from "./processNotification"
import { RouteData } from "src/core/types"

export type ProjectNotificationData = {
  id: number
  createdAt: Date
  cleanMessage: string
  rawMessage: string
  notification: ExtendedNotification
  routeData: RouteData | null
}

export function processProjectNotification(
  notifications: ExtendedNotification[]
): ProjectNotificationData[] {
  return notifications.map((notification) => {
    const cleanMessage = stripHtmlTags(notification.message || "")

    return {
      id: notification.id,
      createdAt: notification.createdAt,
      cleanMessage: cleanMessage,
      rawMessage: notification.message || "",
      notification: notification,
      routeData: notification.routeData as RouteData,
    }
  })
}
