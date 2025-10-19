import { useRouter } from "next/router"
import { Routes } from "@blitzjs/next"
import { useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import { ContributorForm } from "src/contributors/components/ContributorForm"
import { Suspense } from "react"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import { CreateProjectMemberFormSchema } from "src/projectmembers/schemas"
import { useInviteContributor } from "src/invites/hooks/useInviteContributor"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import Card from "src/core/components/Card"
import { toast } from "react-hot-toast"

function NewContributor() {
  const projectId = useParam("projectId", "number")
  const handleSubmit = useInviteContributor(projectId!)
  const router = useRouter()

  // Allow multiple emails separated by commas, semicolons, spaces, or new lines
  const multiSubmit = async (values: any) => {
    const raw = (values?.email ?? "").toString()
    const emails = raw
      .split(/[\n,;\s]+/)
      .map((e) => e.trim())
      .filter(Boolean)

    if (emails.length === 0) return

    const loadingToast = toast.loading(
      `Inviting ${emails.length} contributor${emails.length === 1 ? "" : "s"}...`
    )

    const results: string[] = []
    const errors: string[] = []

    // Run sequentially to preserve existing server validations and rate limits
    for (const email of emails) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const res = await handleSubmit({ ...values, email }, { silent: true, skipRedirect: true })
        if (res?.ok) {
          results.push(email)
        } else {
          errors.push(email)
        }
      } catch {
        errors.push(email)
      }
    }

    const succeeded = results.length
    const failed = errors.length
    const message =
      failed === 0
        ? `✅ Successfully invited ${succeeded} contributor${succeeded === 1 ? "" : "s"}.`
        : `✅ Invited ${succeeded} contributor${
            succeeded === 1 ? "" : "s"
          }, ❌ failed for ${failed}: ${errors.join(", ")}.`

    toast.dismiss(loadingToast)
    toast.success(message)

    // After processing, take the user to the invites page where they can see statuses
    await router.push(Routes.InvitesPagePM({ projectId: projectId! }))
  }

  return (
    <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center items-center text-3xl">
        Invite New Contributor(s)
        <InformationCircleIcon
          className="h-6 w-6 ml-2 text-info stroke-2"
          data-tooltip-id="contributors-overview"
        />
        <Tooltip
          id="contributors-overview"
          content="You can invite one person or paste multiple emails separated by commas, spaces, semicolons, or new lines. Define roles, and give them tags for classifying."
          className="z-[1099] ourtooltips"
        />
      </h1>
      <p className="mt-2 mb-2 text-lg">
        Enter the email(s) of the contributor(s) you want to add to the project. You can paste
        multiple emails separated by commas, spaces, semicolons, or new lines. They will receive
        invitations, and you can add them to tasks or teams after they accept. All contributors
        entered together will have the same privilege, roles, and tags. You can add or change these
        values after they accept your invite.
      </p>
      <p className="mt-2 mb-2 text-lg">
        Each person will receive an email from app@staple.science. The email may go to spam and may
        need to be marked as safe to ensure all notification emails are received.
      </p>
      <Card title="">
        <ContributorForm
          projectId={projectId!}
          className="flex flex-col"
          submitText="Send Invite(s)"
          schema={CreateProjectMemberFormSchema}
          onSubmit={multiSubmit}
          isEdit={false}
          cancelText="Cancel"
          onCancel={() => router.push(Routes.InvitesPagePM({ projectId: projectId! }))}
        />
      </Card>
    </main>
  )
}

const NewContributorPage = () => {
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Invite New Contributor">
      <Suspense fallback={<div>Loading...</div>}>
        <NewContributor />
      </Suspense>
    </Layout>
  )
}

NewContributorPage.authenticate = true

export default NewContributorPage
