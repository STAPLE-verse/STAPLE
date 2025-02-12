import DOMPurify from "dompurify"
import NotificationMessage from "./NotificationMessage"
import { RouteData } from "src/core/types"

interface Notification {
  id: number
  message: string
  routeData: RouteData | null
}

interface NotificationItemProps {
  notification: Notification
}

const NotificationItem = ({ notification }: NotificationItemProps) => {
  const cleanMessage = DOMPurify.sanitize(notification.message)

  return (
    <div key={notification.id} className="p-4 rounded-lg shadow-md">
      <NotificationMessage message={cleanMessage} routeData={notification.routeData} />
    </div>
  )
}

export default NotificationItem
