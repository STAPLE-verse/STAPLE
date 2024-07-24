import { useQuery } from "@blitzjs/rpc"
import getUnreadNotificationsCount from "../queries/getUnreadNotificationsCount"
import getLatestUnreadNotifications from "../queries/getLatestUnreadNotifications"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

export const useNotificationMenuData = () => {
  const currentUser = useCurrentUser()

  const [unreadCountData, { refetch: refetchCount }] = useQuery(
    getUnreadNotificationsCount,
    {
      where: {
        recipients: {
          some: {
            id: currentUser?.id,
          },
        },
      },
    },
    { enabled: !!currentUser }
  )

  const [latestUnreadNotificationsData, { refetch: refetchLatestUnread }] = useQuery(
    getLatestUnreadNotifications,
    {},
    { enabled: !!currentUser }
  )

  const unreadCount = unreadCountData?.unreadCount || 0
  const latestUnreadNotifications = latestUnreadNotificationsData?.notifications || []

  const updateNotificationMenuData = async () => {
    await refetchCount()
    await refetchLatestUnread()
  }

  return { unreadCount, latestUnreadNotifications, updateNotificationMenuData }
}
