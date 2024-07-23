import { useMutation } from "@blitzjs/rpc"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import updateNotifications from "../mutations/updateNotifications"

const ReadToggle = ({ notification, refetch }) => {
  const [updateNotificationMutation] = useMutation(updateNotifications)
  const [isRead, setIsRead] = useState(notification.read)

  const toggleReadStatus = async () => {
    const newReadStatus = !isRead

    try {
      await updateNotificationMutation({
        id: notification.id,
        read: newReadStatus,
      })
      setIsRead(newReadStatus)

      await refetch()
    } catch (error) {
      console.error("Failed to update notification:", error)
    }
  }

  return (
    <div onClick={toggleReadStatus} className="cursor-pointer">
      {isRead ? (
        <EyeIcon className="h-8 w-8 text-blue-500 cursor-pointer transition duration-150 ease-in-out hover:text-blue-700 focus:text-blue-700 focus:outline-none" />
      ) : (
        <EyeSlashIcon className="h-8 w-8 text-gray-500 cursor-pointer transition duration-150 ease-in-out hover:text-gray-700 focus:text-gray-700 focus:outline-none" />
      )}
    </div>
  )
}

export default ReadToggle
