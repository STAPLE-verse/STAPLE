import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import toast from "react-hot-toast"
import createInvite from "src/invites/mutations/createInvite"
import { FORM_ERROR } from "final-form"
import { Routes } from "@blitzjs/next"
import { sendInvitationEmail } from "../utils/sendInvitationEmail"

export function useInviteContributor(projectId: number) {
  const [createInviteMutation] = useMutation(createInvite)
  const router = useRouter()
  const currentUser = useCurrentUser()

  const handleSubmit = async (values: any) => {
    try {
      const projectMember = await createInviteMutation({
        projectId: projectId,
        privilege: values.privilege,
        addedBy: currentUser!.username,
        email: values.email,
        rolesId: values.rolesId,
      })

      if (projectMember.code === "already_added") {
        return { [FORM_ERROR]: "User is already a contributor on the project." }
      }

      const emailSent = await sendInvitationEmail(values, currentUser, projectMember.projectmember)
      if (!emailSent) {
        console.error("Failed to send invitation email")
      }

      await toast.promise(Promise.resolve(projectMember), {
        loading: "Inviting projectMember...",
        success: "Contributor invited to the project!",
        error: "Failed to add the projectMember...",
      })

      await router.push(Routes.ContributorsPage({ projectId }))
    } catch (error: any) {
      console.error(error)
      return { [FORM_ERROR]: error.toString() }
    }
  }

  return handleSubmit
}
