import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import toast from "react-hot-toast"
import createInvite from "src/invites/mutations/createInvite"
import { FORM_ERROR } from "final-form"
import { Routes } from "@blitzjs/next"
import { sendInvitationEmail } from "../utils/sendInvitationEmail"
import { createNewInvitation, createReassignmentInvitation } from "integrations/emails"

export function useInviteContributor(projectId: number) {
  const [createInviteMutation] = useMutation(createInvite)
  const router = useRouter()
  const currentUser = useCurrentUser()

  const handleEmailSending = async (emailData, successMessage, errorMessage) => {
    const emailSent = await sendInvitationEmail(emailData)
    if (emailSent) {
      toast.success(successMessage)
    } else {
      console.error(errorMessage)
      toast.error(errorMessage)
    }
  }

  const handleSubmit = async (values: any) => {
    try {
      const projectMember = await createInviteMutation({
        projectId: projectId,
        privilege: values.privilege,
        addedBy: currentUser
          ? currentUser.firstName?.trim() && currentUser.lastName?.trim()
            ? `${currentUser.firstName} ${currentUser.lastName}`
            : currentUser!.username
          : "Unknown User",
        email: values.email,
        rolesId: values.rolesId,
        tags: values.tags,
      })

      switch (projectMember.code) {
        case "already_added":
          return { [FORM_ERROR]: "User is already a contributor on the project." }

        case "restore_possible":
          await handleEmailSending(
            createReassignmentInvitation(values, currentUser, projectMember.projectmember),
            "Reassignment invitation sent to the contributor!",
            "Failed to send reassignment email"
          )
          break

        case "invite_sent":
          await handleEmailSending(
            createNewInvitation(values, currentUser, projectMember.projectmember),
            "Contributor invited to the project!",
            "Failed to send invitation email"
          )
          break

        default:
          toast.error("Unexpected response code.")
          break
      }

      // Redirect to ContributorsPage after handling the invitation
      await router.push(Routes.ContributorsPage({ projectId }))
    } catch (error: any) {
      console.error(error)
      return { [FORM_ERROR]: error.toString() }
    }
  }

  return handleSubmit
}
