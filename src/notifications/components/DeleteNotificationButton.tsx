import { useMutation } from "@blitzjs/rpc"
import deleteNotification from "../mutations/deleteNotification"
import toast from "react-hot-toast"
import { Prisma } from "db"

interface DeleteNotificationButtonProps {
  ids: number[]
  where: Prisma.NotificationWhereInput
  selectionMode: "ids" | "all"
  totalSelectedCount: number
  onCompleted?: () => void
}

export const DeleteNotificationButton = ({
  ids,
  where,
  selectionMode,
  totalSelectedCount,
  onCompleted,
}: DeleteNotificationButtonProps) => {
  const [deleteNotificationMutation] = useMutation(deleteNotification)

  const handleDelete = async () => {
    const countLabel =
      selectionMode === "all" ? totalSelectedCount : Math.max(ids.length, totalSelectedCount)

    if (
      window.confirm(
        `The selected ${countLabel} notification(s) will be permanently deleted. Are you sure you want to continue?`
      )
    ) {
      try {
        if (selectionMode === "all") {
          await deleteNotificationMutation({ selectAll: true, where })
        } else {
          await deleteNotificationMutation({ ids })
        }
        toast.success("Notifications deleted successfully!")
        onCompleted?.()
      } catch (error) {
        console.error("Error deleting notifications:", error)
        toast.error("Failed to delete notifications.")
      }
    }
  }

  const isDisabled =
    selectionMode === "all"
      ? totalSelectedCount === 0
      : ids.length === 0 || totalSelectedCount === 0

  return (
    <button className="btn btn-secondary" onClick={handleDelete} disabled={isDisabled}>
      Delete {totalSelectedCount > 1 ? "Notifications" : "Notification"}
    </button>
  )
}
