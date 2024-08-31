import { Suspense, useState } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { InvitesList } from "src/invites/components/InvitesList"
import { Modal } from "react-overlays"
import { InviteForm } from "src/invites/components/InviteForm"
import { InviteFormSchema } from "src/invites/schemas"
import toast from "react-hot-toast"
import { FORM_ERROR } from "final-form"
import createContributor from "src/contributors/mutations/createContributor"
import { useMutation } from "@blitzjs/rpc"

const InvitesPage = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()

  const [openNewInviteModal, setOpenNewInviteModal] = useState(false)
  const handleToggleNewInviteModal = () => {
    setOpenNewInviteModal((prev) => !prev)
  }
  const [createContributorMutation] = useMutation(createContributor)

  const handleInviteCode = async (values) => {
    try {
      const invite = await createContributorMutation({
        invitationCode: values.invitationCode,
        userId: values.userId,
      })

      await toast.promise(Promise.resolve(invite), {
        loading: "Adding project...",
        success: "Project added!",
        error: "Failed add project...",
      })
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  return (
    <Layout>
      <Head>
        <title>Project Invitations</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2 text-3xl">Project Invitations</h1>

        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <InvitesList currentUser={currentUser} />
            <div>
              <button>Accept by Code</button>
              <Modal open={openNewInviteModal} size="w-7/8 max-w-xl">
                <div className="">
                  <h1 className="flex justify-center mb-2 text-3xl">Enter Invite Code</h1>
                  <div className="flex justify-start mt-4">
                    <InviteForm
                      schema={InviteFormSchema}
                      submitText="Create Role"
                      className="flex flex-col"
                      onSubmit={handleInviteCode}
                      userId={currentUser?.id}
                    ></InviteForm>
                  </div>

                  <div className="modal-action flex justify-end mt-4">
                    <button
                      type="button"
                      /* button for popups */
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
