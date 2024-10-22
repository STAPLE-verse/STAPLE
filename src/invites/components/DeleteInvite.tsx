import { useMutation } from "@blitzjs/rpc"
import declineInvite from "../mutations/declineInvite"
import toast from "react-hot-toast"
import { FORM_ERROR } from "final-form"
import { XCircleIcon } from "@heroicons/react/24/outline"

export const DeleteInvite = ({ row }) => {
  const [declineInviteMutation] = useMutation(declineInvite)
  const { id = null, onChangeCallback = null, ...rest } = { ...row }

  const handleDeleteInvite = async (values) => {
    if (window.confirm("This invitation will be permanently deleted. Are you sure to continue?")) {
      try {
        const updated = await declineInviteMutation({
          id: id,
        })
        if (onChangeCallback != undefined) {
          onChangeCallback()
        }
        await toast.promise(Promise.resolve(updated), {
          loading: "Deleting invitation...",
          success: "Invitation deleted!",
          error: "Failed to delete the invitation...",
        })
      } catch (error: any) {
        console.error(error)
        return {
          [FORM_ERROR]: error.toString(),
        }
      }
    }
  }

  return (
    <div>
      <button
        type="button"
        /* button for popups */
        className="btn btn-ghost"
        onClick={handleDeleteInvite}
      >
        <XCircleIcon width={50} className="stroke-primary">
          Decline
        </XCircleIcon>
      </button>
    </div>
  )
}
