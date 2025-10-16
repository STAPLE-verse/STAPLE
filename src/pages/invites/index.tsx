import { Suspense, useState } from "react"
import { useRouter } from "next/router"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { InvitesList } from "src/invites/components/InvitesList"
import Modal from "src/core/components/Modal"
import { InviteForm } from "src/invites/components/InviteForm"
import { InviteFormSchema } from "src/invites/schemas"
import toast from "react-hot-toast"
import acceptInvite from "src/invites/mutations/acceptInvite"
import getInviteByCode from "src/invites/queries/getInviteByCode"
import { useMutation, invoke } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import Card from "src/core/components/Card"
import { Tooltip } from "react-tooltip"

const InvitesPage = () => {
  const currentUser = useCurrentUser()
  const router = useRouter()

  const [openNewInviteModal, setOpenNewInviteModal] = useState(false)
  const handleToggleNewInviteModal = () => {
    setOpenNewInviteModal((prev) => !prev)
  }
  const [acceptInviteMutation] = useMutation(acceptInvite)
  const [formError, setFormError] = useState<string | null>(null)

  const handleInviteCode = async (values) => {
    try {
      if (!currentUser?.id) {
        setFormError("You must be logged in to accept an invite.")
        return
      }

      // 1) Look up the invite by code via RPC invoke
      const invite = await invoke(getInviteByCode, { code: values.invitationCode })
      if (!invite) {
        setFormError("No matching invitation code found.")
        return
      }

      // 2) Accept the invite via the canonical mutation
      const result = await toast.promise(
        acceptInviteMutation({ id: invite.id, userId: currentUser.id }),
        {
          loading: "Adding project...",
          success: "Project added!",
          error: "Failed to add project...",
        }
      )

      setFormError(null)
      const projectId = (result?.id as number | undefined) ?? invite.projectId
      await router.push(Routes.ShowProjectPage({ projectId }))
    } catch (error: any) {
      console.error(error)
      setFormError("An error occurred during the submission. Please try again.")
    }
  }

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Project Invitations">
      <main className="flex flex-col mx-auto w-full">
        <h1 className="flex justify-center items-center text-3xl">
          Project Invitations
          <InformationCircleIcon
            className="h-6 w-6 ml-2 text-info stroke-2"
            data-tooltip-id="invites-overview"
          />
          <Tooltip
            id="invites-overview"
            content="This page shows invitations to projects (for the email associated with this account). You can accept or decline the invitation. If you do not see the invitation, you can get the invitation code from your email and accept the project invitation by clicking Accept by Code and entering the invite code."
            className="z-[1099] ourtooltips"
          />
        </h1>

        <div className="mt-4 mb-2 justify-center flex flex-row">
          <button type="button" className="btn btn-primary" onClick={handleToggleNewInviteModal}>
            Accept by Code
          </button>
          <Modal open={openNewInviteModal} size="w-7/8 max-w-xl">
            <div className="">
              <h1 className="flex justify-center m-4 text-3xl">Enter Invite Code</h1>
              <div className="flex justify-start mt-4">
                <InviteForm
                  schema={InviteFormSchema}
                  submitText="Add Project"
                  className="flex flex-col w-full"
                  onSubmit={(data) => handleInviteCode(data)}
                  userId={currentUser!.id}
                  cancelText="Close"
                  onCancel={handleToggleNewInviteModal}
                ></InviteForm>
              </div>
              {formError && (
                <div className="error-message text-red-600 mt-2 font-bold">{formError}</div>
              )}
            </div>
          </Modal>
        </div>

        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <Card title={""}>
              <InvitesList currentUser={currentUser} />
            </Card>
          </Suspense>
        </div>
      </main>
    </Layout>
  )
}

export default InvitesPage
