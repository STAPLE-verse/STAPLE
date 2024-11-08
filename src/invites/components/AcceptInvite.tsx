import { useMutation } from "@blitzjs/rpc"
import acceptInvite from "../mutations/acceptInvite"
import { useRouter } from "next/router"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import toast from "react-hot-toast"
import { FORM_ERROR } from "final-form"
import { CheckCircleIcon } from "@heroicons/react/24/outline"
import { Routes } from "@blitzjs/next"

export const AcceptInvite = ({ row }) => {
  const [acceptInviteMutation] = useMutation(acceptInvite)
  const router = useRouter()
  const currentUser = useCurrentUser()
  const { id = null, onChangeCallback = null, ...rest } = { ...row }

  const handleAcceptInvite = async (values) => {
    try {
      const updated = await acceptInviteMutation({
        id: id,
        userId: currentUser!.id,
      })

      if (onChangeCallback != undefined) {
        onChangeCallback()
      }

      await toast.promise(Promise.resolve(updated), {
        loading: "Accepting invitation...",
        success: "Invitation accepted!",
        error: "Failed to accept the invitation...",
      })

      await router.push(Routes.ShowProjectPage({ projectId: updated!.id }))
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  return (
    <div>
      <button
        type="button"
        /* button for popups */
        className="btn btn-ghost"
        onClick={handleAcceptInvite}
      >
        <CheckCircleIcon width={50} className="stroke-primary">
          Accept
        </CheckCircleIcon>
      </button>
    </div>
  )
}
