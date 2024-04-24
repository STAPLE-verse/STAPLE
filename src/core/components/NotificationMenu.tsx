import { Routes } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import { BellIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import getNotifications from "src/messages/queries/getNotifications"
import DOMPurify from "dompurify"

const NotificationsMenu = ({ userId }) => {
  const [notifications] = useQuery(getNotifications, {
    where: {
      read: false,
      recipients: {
        some: { id: userId },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 250,
    include: {
      recipients: true,
    },
  })

  // Count unread notifications
  const unreadCount = notifications.notifications.length

  // Display the first three notifications
  const snipetOfNotifications = notifications.notifications.slice(0, 3).map((notification) => {
    const cleanMessage = DOMPurify.sanitize(notification.message)
    return (
      <div
        key={notification.id}
        className="text-info"
        dangerouslySetInnerHTML={{ __html: cleanMessage }}
      ></div>
    )
  })

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle">
        <div className="indicator">
          <BellIcon className="w-5 h-5" />
          <span className="badge badge-sm indicator-item">{unreadCount}</span>
        </div>
      </label>
      <div
        tabIndex={0}
        className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow"
      >
        <div className="card-body">
          <span className="font-bold text-lg">{unreadCount} Notifications</span>
          {snipetOfNotifications.length > 0 ? (
            snipetOfNotifications
          ) : (
            <span className="text-info">No new notifications.</span>
          )}
          <div className="card-actions">
            <Link className="btn btn-primary btn-block" href={Routes.NotificationsPage()}>
              View notifications
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationsMenu
