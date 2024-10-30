import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import { useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import Link from "next/link"
import { MemberPrivileges } from "db"
import { useMemberPrivileges } from "src/projectprivileges/components/MemberPrivilegesContext"
import { Tooltip } from "react-tooltip"
import { ContributorTaskListDone } from "src/contributors/components/ContributorTaskListDone"
import { ContributorRolesList } from "src/roles/components/ContributorRolesList"
import DeleteContributor from "src/contributors/components/DeleteContributor"
import ContributorInformation from "src/contributors/components/ContributorInformation"
import { useContributorData } from "src/contributors/hooks/useContributorData"

export const ContributorPage = () => {
  const { privilege } = useMemberPrivileges()
  const contributorId = useParam("contributorId", "number")
  const projectId = useParam("projectId", "number")

  const { contributor, contributorUser, contributorPrivilege, teamNames } = useContributorData(
    contributorId!,
    projectId!
  )

  return (
    <>
      <Head>
        <title>{contributorUser!.username} Contributions</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
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

        <ContributorTaskListDone
          contributorId={contributorId!}
          projectId={projectId!}
          privilege={privilege!}
        />

        {privilege === MemberPrivileges.PROJECT_MANAGER && (
          <div className="flex justify-end">
            <DeleteContributor contributor={contributor!} />
          </div>
        )}
      </main>
    </>
  )
}

const ShowContributorPage = () => {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <ContributorPage />
      </Suspense>
    </Layout>
  )
}

ShowContributorPage.authenticate = true

export default ShowContributorPage
