import { useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import { ContributorForm } from "src/contributors/components/ContributorForm"
import { Suspense } from "react"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import { CreateProjectMemberFormSchema } from "src/projectmembers/schemas"
import PageHeader from "src/core/components/PageHeader"
import { useInviteContributor } from "src/invites/hooks/useInviteContributor"

function NewContributor() {
  const projectId = useParam("projectId", "number")
  const handleSubmit = useInviteContributor(projectId!)

  return (
    <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
      <PageHeader title="Invite New Contributor" />
      <Suspense fallback={<div>Loading...</div>}>
        <p className="mt-2 mb-2 text-lg">
          Enter the email of the contributor you would like to add to the project. They will receive
          an email inviting them to join the project. You will not be able to add them to tasks or
          teams until they accept their invitation.
        </p>
        <ContributorForm
          projectId={projectId!}
          className="flex flex-col"
          submitText="Add Contributor"
          schema={CreateProjectMemberFormSchema}
          onSubmit={handleSubmit}
          isEdit={false}
        />
      </Suspense>
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
