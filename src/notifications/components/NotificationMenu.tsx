import { Routes } from "@blitzjs/next"
import { BellIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import DOMPurify from "dompurify"
import { useNotificationMenuData } from "../hooks/useNotificationMenuData"
import { Tooltip } from "react-tooltip"

const NotificationsMenu = () => {
  // Get notification counts and the latest notifications
  const { unreadCount, latestUnreadNotifications } = useNotificationMenuData()

  // Display the first three notifications
  const snippetOfNotifications = latestUnreadNotifications.map((notification) => {
    const cleanMessage = DOMPurify.sanitize(notification.message)
    return (
      <div
        key={notification.id}
        className="p-4 rounded-lg shadow-md"
        // Make sure that HTML is read properly
        dangerouslySetInnerHTML={{ __html: cleanMessage }}
      ></div>
    )
  })

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle">
        <div className="indicator">
          <BellIcon className="w-5 h-5" data-tooltip-id="notifications-top-tooltip" />
          <Tooltip
            id="notifications-top-tooltip"
            content="View all notifications across projects."
            className="z-[1099]"
            place="left"
          />

          <span className="badge badge-sm indicator-item">{unreadCount}</span>
        </div>
      </label>
      <div
        tabIndex={0}
        className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow"
      >
        <div className="card-body">
          <span className="font-bold text-lg">{unreadCount} Notifications</span>
          {snippetOfNotifications.length > 0 ? (
            snippetOfNotifications
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
