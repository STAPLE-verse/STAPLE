import { Routes } from "@blitzjs/next"
import { BellIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import DOMPurify from "dompurify"
import { useNotification } from "src/messages/components/NotificationContext"

const NotificationsMenu = () => {
  // Get notification counts
  const { notifications, count } = useNotification()

  // Display the first three notifications
  const snipetOfNotifications = notifications.slice(0, 3).map((notification) => {
    const cleanMessage = DOMPurify.sanitize(notification.message)
    return (
      <div
        key={notification.id}
        className="p-4 rounded-lg shadow-md"
        dangerouslySetInnerHTML={{ __html: cleanMessage }}
      ></div>
    )
  })

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle">
        <div className="indicator">
          <BellIcon className="w-5 h-5" />
          <span className="badge badge-sm indicator-item">{count.unread}</span>
        </div>
      </label>
      <div
        tabIndex={0}
        className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow"
      >
        <div className="card-body">
          <span className="font-bold text-lg">{count.unread} Notifications</span>
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
