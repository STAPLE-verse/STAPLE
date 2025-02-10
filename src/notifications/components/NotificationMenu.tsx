import { BellIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { Tooltip } from "react-tooltip"
import { Routes } from "@blitzjs/next"
import { useNotificationMenuData } from "../hooks/useNotificationMenuData"
import NotificationItem from "./NotificationItem"

const NotificationsMenu = () => {
  const { unreadCount, latestUnreadNotifications } = useNotificationMenuData()

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle">
        <div className="indicator">
          <BellIcon className="w-5 h-5" data-tooltip-id="notifications-top-tooltip" />
          <Tooltip
            id="notifications-top-tooltip"
            content="View all notifications across projects."
            className="z-[1099] ourtooltips"
            place="left"
          />
          <span className="badge badge-sm indicator-item">{unreadCount}</span>
        </div>
      </label>

      <div
        tabIndex={0}
        className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-300 shadow"
      >
        <div className="card-body">
          <span className="font-bold text-lg">{unreadCount} Notifications</span>

          {latestUnreadNotifications.length > 0 ? (
            latestUnreadNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          ) : (
            <span className="text-info">No new notifications.</span>
          )}

          <div className="card-actions">
            <Link className="btn btn-primary btn-block" href={Routes.NotificationsPage()}>
              View All Notifications
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationsMenu
