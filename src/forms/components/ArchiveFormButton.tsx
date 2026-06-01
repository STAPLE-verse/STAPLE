import { useMutation } from "@blitzjs/rpc"
import archiveForm from "../mutations/archiveForm"
import toast from "react-hot-toast"
import { ArchiveBoxIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/outline"

interface ArchiveFormButtonProps {
  formId: number
  isArchived?: boolean
  onDone?: () => void | Promise<void>
}

const ArchiveFormButton = ({ formId, isArchived = false, onDone }: ArchiveFormButtonProps) => {
  const [archiveFormMutation] = useMutation(archiveForm)

  const handleToggle = async () => {
    const message = isArchived
      ? "This will unarchive the form and all of its versions. Are you sure?"
      : "This will archive the form and all of its versions. Are you sure?"

    if (!window.confirm(message)) return

    try {
      await archiveFormMutation({ formId, archived: !isArchived })
      toast.success(isArchived ? "Form unarchived." : "Form archived.")
      await onDone?.()
    } catch (error) {
      console.error("Failed to update form archive state:", error)
      toast.error("There was an error updating the form.")
    }
  }

  return (
    <button className="btn btn-ghost" onClick={handleToggle} type="button">
      {isArchived ? (
        <ArrowUturnLeftIcon aria-hidden="true" width={25} className="stroke-primary" />
      ) : (
        <ArchiveBoxIcon aria-hidden="true" width={25} className="stroke-primary" />
      )}
    </button>
  )
}

export default ArchiveFormButton
