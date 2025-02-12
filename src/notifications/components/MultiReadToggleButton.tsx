import { useMutation } from "@blitzjs/rpc"
import updateNotifications from "../mutations/updateNotifications"
import { useNotificationMenuData } from "../hooks/useNotificationMenuData"
import toast from "react-hot-toast"

interface MultiReadToggleButtonProps {
  notifications: { id: number; read: boolean }[]
  refetch: () => void
  resetSelection: () => void
}

export const MultiReadToggleButton = ({
  notifications,
  refetch,
  resetSelection,
}: MultiReadToggleButtonProps) => {
  const [updateNotificationMutation] = useMutation(updateNotifications)
  const { updateNotificationMenuData } = useNotificationMenuData()

  const allRead = notifications.every((n) => n.read)
  const allUnread = notifications.every((n) => !n.read)
  const mixedStatus = !allRead && !allUnread

  const handleToggle = async (markAsRead: boolean) => {
    if (notifications.length === 0) return // Prevent unnecessary calls when no notifications are selected

    try {
      await Promise.all(
        notifications.map((n) => updateNotificationMutation({ id: n.id, read: markAsRead }))
      )

      toast.success(
        `${notifications.length} notification${notifications.length > 1 ? "s" : ""} marked as ${
          markAsRead ? "read" : "unread"
        }.`
      )

      await updateNotificationMenuData()
      await refetch()
      await resetSelection()
    } catch (error) {
      console.error("Failed to update notifications:", error)
      toast.error("Failed to update some notifications.")
    }
  }

  const noSelection = notifications.length === 0

  return (
    <div className="flex gap-2 mt-4">
      {(allUnread || mixedStatus) && (
        <button
          className="btn btn-primary"
          onClick={() => handleToggle(true)}
          disabled={noSelection}
        >
          {mixedStatus ? "Mark All as Read" : "Mark as Read"}
        </button>
      )}

      {(allRead || mixedStatus) && (
        <button
          className="btn btn-secondary"
          onClick={() => handleToggle(false)}
          disabled={noSelection}
        >
          {mixedStatus ? "Mark All as Unread" : "Mark as Unread"}
        </button>
      )}
    </div>
  )
}
