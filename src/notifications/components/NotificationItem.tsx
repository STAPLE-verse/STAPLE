import Link from "next/link"
import DOMPurify from "dompurify"
import { isRouteData } from "../utils/isRouteData"

interface Notification {
  id: number
  message: string
  routeData?: any // Stored as JSON in the DB
}

interface NotificationItemProps {
  notification: Notification
}

const NotificationItem = ({ notification }: NotificationItemProps) => {
  const cleanMessage = DOMPurify.sanitize(notification.message)

  return (
    <div key={notification.id} className="p-4 rounded-lg shadow-md">
      {isRouteData(notification.routeData) ? (
        <Link
          href={{
            pathname: notification.routeData.path,
            query: notification.routeData.params,
          }}
          className="hover:underline text-primary"
        >
          <div dangerouslySetInnerHTML={{ __html: cleanMessage }}></div>
        </Link>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: cleanMessage }}></div>
      )}
    </div>
  )
}

export default NotificationItem
