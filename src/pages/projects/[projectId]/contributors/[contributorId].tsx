import { Suspense } from "react"
import { useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import { useMemberPrivileges } from "src/projectprivileges/components/MemberPrivilegesContext"
import { ContributorTaskList } from "src/contributors/components/ContributorTaskList"
import { ContributorRolesList } from "src/contributors/components/ContributorRolesList"
import ContributorInformation from "src/contributors/components/ContributorInformation"
import { useContributorData } from "src/contributors/hooks/useContributorData"

export const ContributorPage = () => {
  const { privilege } = useMemberPrivileges()
  const contributorId = useParam("contributorId", "number")
  const projectId = useParam("projectId", "number")

  const { contributorUser, contributorPrivilege, teamNames } = useContributorData(
    contributorId!,
    projectId!
  )

  return (
    <>
      <main className="flex flex-col mx-auto w-full">
        <ContributorInformation
          projectId={projectId!}
          privilege={privilege!}
          contributorId={contributorId!}
          teamNames={teamNames}
          contributorPrivilege={contributorPrivilege}
          contributorUser={contributorUser!}
        />

        <ContributorRolesList
          usersId={[contributorUser!.id]}
          projectId={projectId!}
          privilege={privilege!}
        />

        <ContributorTaskList
          contributorId={contributorId!}
          projectId={projectId!}
          privilege={privilege!}
        />
      </main>
    </>
  )
}

const ShowContributorPage = () => {
  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Contributions">
      <Suspense fallback={<div>Loading...</div>}>
        <ContributorPage />
      </Suspense>
    </Layout>
  )
}

ShowContributorPage.authenticate = true

export default ShowContributorPage
