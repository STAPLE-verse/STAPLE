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
      "Versions with no tasks or projects will be permanently deleted. Versions currently in use will be archived instead. Are you sure?"
    )

    if (!isConfirmed) return

    try {
      const result = await deleteFormMutation({ formId })
      if (result.action === "archived") {
        toast.success("Form archived — some versions are still in use by tasks or projects.")
      } else {
        toast.success("Form deleted.")
      }
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
