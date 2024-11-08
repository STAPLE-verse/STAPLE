import { useMutation } from "@blitzjs/rpc"
import deleteRole from "../mutations/deleteRole"
import toast from "react-hot-toast"
import { FORM_ERROR } from "final-form"
import { XCircleIcon } from "@heroicons/react/24/outline"

export const DeleteColumn = ({ row }) => {
  const [deleteRoleMutation] = useMutation(deleteRole)
  const { id = null, onChangeCallback = null, ...rest } = { ...row }

  const handleDeleteRole = async (values) => {
    if (window.confirm("This role will be permanently deleted. Are you sure to continue?")) {
      try {
        const updated = await deleteRoleMutation({
          id: id,
        })
        if (onChangeCallback != undefined) {
          onChangeCallback()
        }
        await toast.promise(Promise.resolve(updated), {
          loading: "Deleting role...",
          success: "Role deleted!",
          error: "Failed to delete the role...",
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
        onClick={handleDeleteRole}
      >
        <XCircleIcon width={25} className="stroke-primary" />
      </button>
    </div>
  )
}
