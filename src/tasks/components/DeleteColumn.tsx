import { useMutation } from "@blitzjs/rpc"
import { TrashIcon } from "@heroicons/react/24/outline"
import deleteColumn from "src/tasks/mutations/deleteColumn"
import toast from "react-hot-toast"

interface DeleteColumnProps {
  columnId: number
  columnName: string
  onDeleted?: () => void
}

const DeleteColumn = ({ columnId, columnName, onDeleted }: DeleteColumnProps) => {
  const [deleteColumnMutation] = useMutation(deleteColumn)

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete the column "${columnName}"? This cannot be undone.`
      )
    ) {
      try {
        await deleteColumnMutation({ id: columnId })
        toast.success(`Column "${columnName}" deleted.`)
        onDeleted?.()
      } catch (error: any) {
        toast.error(error.message || "Failed to delete column.")
      }
    }
  }

  return (
    <button onClick={handleDelete} title="Delete column">
      <TrashIcon className="w-6 h-6 text-base-content border-transparent rounded-2xl hover:opacity-50" />
    </button>
  )
}

export default DeleteColumn
