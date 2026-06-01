import { useMutation } from "@blitzjs/rpc"
import deleteForm from "../mutations/deleteForm"
import toast from "react-hot-toast"
import { TrashIcon } from "@heroicons/react/24/outline"

interface DeleteFormButtonProps {
  formId: number
  onDeleted?: () => void | Promise<void>
}

const DeleteFormButton = ({ formId, onDeleted }: DeleteFormButtonProps) => {
  const [deleteFormMutation] = useMutation(deleteForm)

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "This will permanently delete the form and all of its versions. Are you sure you want to continue?"
    )

    if (!isConfirmed) return

    try {
      await deleteFormMutation({ formId })
      toast.success("Form deleted.")
      await onDeleted?.()
    } catch (error) {
      console.error("Failed to delete form:", error)
      toast.error("There was an error deleting the form.")
    }
  }

  return (
    <button className="btn btn-ghost" onClick={handleDelete} type="button">
      <TrashIcon aria-hidden="true" width={25} className="stroke-primary" />
    </button>
  )
}

export default DeleteFormButton
