import { Routes } from "@blitzjs/next"
import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import createInvite from "src/contributors/mutations/createInvite"
import { ContributorForm } from "src/contributors/components/ContributorForm"
import { FORM_ERROR } from "final-form"
import { Suspense } from "react"
import Head from "next/head"
import toast from "react-hot-toast"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import useContributorAuthorization from "src/contributors/hooks/UseContributorAuthorization"
import { ContributorPrivileges } from "db"
import { createInviteFormSchema } from "src/contributors/schemas"

const NewContributor = () => {
  const [createInviteMutation] = useMutation(createInvite)
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

      const msg = {
        from: "staple.helpdesk@gmail.com",
        to: values.email,
        subject: "STAPLE Project Invitation",
        html: `
          <h3>STAPLE Project Invitation</h3>

          You've been invited to collaborate on a STAPLE project by
          ${currentUser!.username}. STAPLE is project management software that
          allows you to document your research project to improve transparency. If you
          wish to join the project, please log in at: https://app.staple.science/. You
          can join the project by clicking on Invitations on the sidebar menu and click "Accept"
          or decline the project invitation by clicking "Decline".
          <p>
          If you want to join the project, but have an account under a different
          email, you can log in or create an account with your desired email. Then
          click Invitations on the sidebar menu and click "Accept by Code". You would
          use code: "${contributor.invitationCode}" to add this project.
          <p>
          If you need more help, you can reply to this email to create a ticket.
          <p>
          Thanks,
          <br>
          STAPLE HelpDesk
        `,
      }

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(msg),
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
        Routes.ProjectsPage({
          projectId: projectId!,
        })
      )
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
        <ContributorForm
          projectId={projectId as number}
          className="flex flex-col"
          submitText="Add Contributor"
          schema={createInviteFormSchema}
          onSubmit={handleSubmit}
        />
      </Suspense>
    </main>
  )
}

const NewContributorPage = () => {
  useContributorAuthorization([ContributorPrivileges.PROJECT_MANAGER])

  return (
    <Layout>
      <Head>
        <title>Invite New Contributor</title>
      </Head>
      <Suspense fallback={<div>Loading...</div>}>
        <NewContributor />
      </Suspense>
    </Layout>
  )
}

NewContributorPage.authenticate = true

export default NewContributorPage
