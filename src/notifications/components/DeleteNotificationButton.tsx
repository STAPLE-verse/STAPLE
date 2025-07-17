import { useMutation } from "@blitzjs/rpc"
import deleteNotification from "../mutations/deleteNotification"
import toast from "react-hot-toast"

interface DeleteNotificationButtonProps {
  ids: number[]
}

export const DeleteNotificationButton = ({ ids }: DeleteNotificationButtonProps) => {
  const [deleteNotificationMutation] = useMutation(deleteNotification)

  const handleDelete = async () => {
    if (
      window.confirm(
        `The selected ${ids.length} notification(s) will be permanently deleted. Are you sure you want to continue?`
      )
    ) {
      try {
        await deleteNotificationMutation({ ids }) // Send array of IDs
        toast.success("Notifications deleted successfully!")
      } catch (error) {
        console.error("Error deleting notifications:", error)
        toast.error("Failed to delete notifications.")
      }
    }
  }

  return (
    <button className="btn btn-secondary" onClick={handleDelete} disabled={ids.length === 0}>
      Delete {ids.length > 1 ? "Notifications" : "Notification"}
    </button>
  )
}
