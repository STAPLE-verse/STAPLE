import { Suspense, useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { InvitesList } from "src/invites/components/InvitesList"
import Modal from "src/core/components/Modal"
import { InviteForm } from "src/invites/components/InviteForm"
import { InviteFormSchema } from "src/invites/schemas"
import toast from "react-hot-toast"
import createProjectMember from "src/projectmembers/mutations/createProjectMember"
import { useMutation } from "@blitzjs/rpc"
import { Routes } from "@blitzjs/next"

const InvitesPage = () => {
  const currentUser = useCurrentUser()
  const router = useRouter()

  const [openNewInviteModal, setOpenNewInviteModal] = useState(false)
  const handleToggleNewInviteModal = () => {
    setOpenNewInviteModal((prev) => !prev)
  }
  const [createProjectMemberMutation] = useMutation(createProjectMember)
  const [formError, setFormError] = useState<string | null>(null)

  const handleInviteCode = async (values) => {
    try {
      const invite = await createProjectMemberMutation({
        invitationCode: values.invitationCode,
        userId: values.userId,
      })

      if (invite.code == "no_code") {
        setFormError("No matching invitation code found.")
      } else {
        await toast.promise(Promise.resolve(invite), {
          loading: "Adding project...",
          success: "Project added!",
          error: "Failed add project...",
        })
        setFormError(null)
        await router.push(Routes.ShowProjectPage({ projectId: invite.projectId }))
      }
    } catch (error: any) {
      console.error(error)
      setFormError("An error occurred during the submission. Please try again.")
    }
  }

  return (
    <Layout title="Project Invitations">
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2 text-3xl">Project Invitations</h1>

        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <InvitesList currentUser={currentUser} />
            <div className="mt-4">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleToggleNewInviteModal}
              >
                Accept by Code
              </button>
              <Modal open={openNewInviteModal} size="w-7/8 max-w-xl">
                <div className="">
                  <h1 className="flex justify-center mb-2 text-3xl">Enter Invite Code</h1>
                  <div className="flex justify-start mt-4">
                    <InviteForm
                      schema={InviteFormSchema}
                      submitText="Add Project"
                      className="flex flex-col w-full"
                      onSubmit={(data) => handleInviteCode({ ...data, userId: currentUser?.id })}
                      userId={currentUser!.id}
                    ></InviteForm>
                  </div>
                  {formError && (
                    <div className="error-message text-red-600 mt-2 font-bold">{formError}</div>
                  )}

                  <div className="modal-action flex justify-end mt-4">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleToggleNewInviteModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Modal>
            </div>
          </Suspense>
        </div>
      </main>
    </Layout>
  )
}

export default InvitesPage
