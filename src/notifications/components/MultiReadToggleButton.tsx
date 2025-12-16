import { useMutation } from "@blitzjs/rpc"
import updateNotifications from "../mutations/updateNotifications"
import { useNotificationMenuData } from "../hooks/useNotificationMenuData"
import toast from "react-hot-toast"
import { Prisma } from "db"
import updateNotificationReadStatusBulk from "../mutations/updateNotificationReadStatusBulk"

interface MultiReadToggleButtonProps {
  notifications: { id: number; read: boolean }[]
  refetch: () => void
  resetSelection: () => void
  selectionMode: "ids" | "all"
  totalSelectedCount: number
  where: Prisma.NotificationWhereInput
}

export const MultiReadToggleButton = ({
  notifications,
  refetch,
  resetSelection,
  selectionMode,
  totalSelectedCount,
  where,
}: MultiReadToggleButtonProps) => {
  const [updateNotificationMutation] = useMutation(updateNotifications)
  const [updateAllNotificationMutation] = useMutation(updateNotificationReadStatusBulk)
  const { updateNotificationMenuData } = useNotificationMenuData()

  const canInferStatus = selectionMode === "ids"
  const allRead = canInferStatus && notifications.every((n) => n.read)
  const allUnread = canInferStatus && notifications.every((n) => !n.read)
  const mixedStatus = canInferStatus && !allRead && !allUnread

  const handleToggle = async (markAsRead: boolean) => {
    if (totalSelectedCount === 0) return

    try {
      if (selectionMode === "all") {
        await updateAllNotificationMutation({ where, read: markAsRead })
      } else {
        await Promise.all(
          notifications.map((n) => updateNotificationMutation({ id: n.id, read: markAsRead }))
        )
      }

      toast.success(
        `${totalSelectedCount} notification${totalSelectedCount > 1 ? "s" : ""} marked as ${
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

  const noSelection = totalSelectedCount === 0

  const showMarkAsReadButton = selectionMode === "all" || allUnread || mixedStatus
  const showMarkAsUnreadButton = selectionMode === "all" || allRead || mixedStatus

  return (
    <div className="flex gap-2">
      {showMarkAsReadButton && (
        <button
          className="btn btn-primary"
          onClick={() => handleToggle(true)}
          disabled={noSelection}
        >
          {selectionMode === "all"
            ? "Mark All as Read"
            : mixedStatus
            ? "Mark All as Read"
            : "Mark as Read"}
        </button>
      )}

      {showMarkAsUnreadButton && (
        <button className="btn btn-info" onClick={() => handleToggle(false)} disabled={noSelection}>
          {selectionMode === "all"
            ? "Mark All as Unread"
            : mixedStatus
            ? "Mark All as Unread"
            : "Mark as Unread"}
        </button>
      )}
    </div>
  )
}
