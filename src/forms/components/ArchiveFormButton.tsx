import { useMutation } from "@blitzjs/rpc"
import archiveForm from "../mutations/archiveForm"
import toast from "react-hot-toast"
import { Form } from "@prisma/client"
import { TrashIcon } from "@heroicons/react/24/outline"

interface ArchiveFormButtonProps {
  formId: number
  onArchived?: (form: Form) => void // Optional callback for when the form is archived
}

const ArchiveFormButton = ({ formId, onArchived }: ArchiveFormButtonProps) => {
  const [archiveFormMutation] = useMutation(archiveForm)

  const handleArchive = async () => {
    const isConfirmed = window.confirm(
      "The form will be deleted. You cannot assign it to tasks anymore, but contributors can still finish tasks with this form assigned. Are you sure to continue?"
    )

    if (!isConfirmed) {
      return
    }

    try {
      const form = await archiveFormMutation({ formId })
      toast.success("Form deleted successfully!")
      if (onArchived) onArchived(form) // Trigger any additional logic when the form is archived
    } catch (error) {
      console.error("Failed to delete form:", error)
      toast.error("There was an error deleting the form.")
    }
  }

  return (
    <button className="btn btn-ghost" onClick={handleArchive}>
      <TrashIcon aria-hidden="true" width={25} className="stroke-primary" />
    </button>
  )
}

export default ArchiveFormButton
