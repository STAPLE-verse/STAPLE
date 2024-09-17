import { Routes } from "@blitzjs/next"
import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import createInvite from "src/invites/mutations/createInvite"
import { ProjectMemberForm } from "src/projectmembers/components/ProjectMemberForm"
import { FORM_ERROR } from "final-form"
import { Suspense, useState } from "react"
import Head from "next/head"
import toast from "react-hot-toast"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import useProjectMemberAuthorization from "src/projectmembers/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import { CreateProjectMemberFormSchema } from "src/projectMember/schemas"
import { createNewInvitation } from "integrations/emails"

function NewProjectMember() {
  const [createInviteMutation] = useMutation(createInvite)
  const [formError, setFormError] = useState<string | null>(null)
  const router = useRouter()
  const projectId = useParam("projectId", "number")
  const currentUser = useCurrentUser()

  // Handle events
  const handleSubmit = async (values) => {
    try {
      const contributor = await createInviteMutation({
        projectId: projectId!,
        privilege: values.privilege,
        addedBy: currentUser!.username,
        email: values.email,
        labelsId: values.labelsId,
      })

      //console.log(contributor)

      if (projectMember.code == "already_added") {
        setFormError("User is already a contributor on the project.")
      } else {
        setFormError(null)

        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(createNewInvitation(values, currentUser, projectMember.contributor)),
        })

        if (response.ok) {
          console.log("Email sent successfully")
        } else {
          console.error("Failed to send email")
        }

        await toast.promise(Promise.resolve(contributor), {
          loading: "Inviting contributor...",
          success: "Contributor invited to the project!",
          error: "Failed to add the contributor...",
        })
        await router.push(
          Routes.ShowProjectPage({
            projectId: projectId!,
          })
        )
      }
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  return (
    <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
      <h1 className="text-3xl">Invite New Contributor</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <p className="mt-2 mb-2 text-lg">
          Enter the email of the contributor you would like to add to the project. They will receive
          an email inviting them to join the project. You will not be able to add them to tasks or
          teams until they accept their invitation.
        </p>
        <ProjectMemberForm
          projectId={projectId as number}
          className="flex flex-col"
          submitText="Add Contributor"
          schema={CreateProjectMemberFormSchema}
          onSubmit={handleSubmit}
        />
        {formError && (
          <div className="error-message text-red-600 mt-2 font-bold"> {formError} </div>
        )}
      </Suspense>
    </main>
  )
}

const NewProjectMemberPage = () => {
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])

  return (
    <Layout>
      <Head>
        <title>Invite New Contributor</title>
      </Head>
      <Suspense fallback={<div>Loading...</div>}>
        <NewProjectMember />
      </Suspense>
    </Layout>
  )
}

NewProjectMemberPage.authenticate = true

export default NewProjectMemberPage
