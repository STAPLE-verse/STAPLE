import { useMutation } from "@blitzjs/rpc"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import updateNotifications from "../mutations/updateNotifications"
import { useNotificationMenuData } from "../hooks/useNotificationMenuData"

const ReadToggle = ({ notification, refetch }) => {
  const [updateNotificationMutation] = useMutation(updateNotifications)
  const { updateNotificationMenuData } = useNotificationMenuData()

  const toggleReadStatus = async () => {
    const newReadStatus = !notification.read
    try {
      await updateNotificationMutation({
        id: notification.id,
        read: newReadStatus,
      })
      await updateNotificationMenuData()
      await refetch()
    } catch (error) {
      console.error("Failed to update notification:", error)
    }
  }

  return (
    <div onClick={toggleReadStatus} className="cursor-pointer">
      {notification.read ? (
        <EyeIcon className="h-8 w-8 text-blue-500 cursor-pointer transition duration-150 ease-in-out hover:text-blue-700 focus:text-blue-700 focus:outline-none" />
      ) : (
        <EyeSlashIcon className="h-8 w-8 text-gray-500 cursor-pointer transition duration-150 ease-in-out hover:text-gray-700 focus:text-gray-700 focus:outline-none" />
      )}
    </div>
  )
}

export default ReadToggle
