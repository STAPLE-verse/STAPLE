import { Notification } from "@prisma/client"

export interface NotificationCounts {
  all: number
  unread: number
}

export default function useCountNotifications(notifications: Notification[]): NotificationCounts {
  const all = notifications.length
  const unread = notifications.filter((notification) => !notification.read).length
  const counts = { all, unread }

  return counts
}
