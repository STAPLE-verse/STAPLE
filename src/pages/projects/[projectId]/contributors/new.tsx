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

function NewContributor() {
  const projectId = useParam("projectId", "number")
  const handleSubmit = useInviteContributor(projectId!)
  const router = useRouter()

  return (
    <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center items-center text-3xl">
        Invite New Contributor
        <InformationCircleIcon
          className="h-6 w-6 ml-2 text-info stroke-2"
          data-tooltip-id="contributors-overview"
        />
        <Tooltip
          id="contributors-overview"
          content="On this page, you can invite a contributor, define their roles, and give them task for classifying."
          className="z-[1099] ourtooltips"
        />
      </h1>
      <p className="mt-2 mb-2 text-lg">
        Enter the email of the contributor you would like to add to the project. They will receive
        an email inviting them to join the project. You will not be able to add them to tasks or
        teams until they accept their invitation.
      </p>
      <Card title="">
        <ContributorForm
          projectId={projectId!}
          className="flex flex-col"
          submitText="Add Contributor"
          schema={CreateProjectMemberFormSchema}
          onSubmit={handleSubmit}
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
