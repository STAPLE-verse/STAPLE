import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import {
  ProjectManagerContributorColumns,
  StandardContributorColumns,
} from "src/contributors/tables/columns/ContributorColumns"
import Table from "src/core/components/Table"
import { useMemberPrivileges } from "src/projectprivileges/components/MemberPrivilegesContext"
import { MemberPrivileges } from "@prisma/client"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { useContributorsData } from "src/contributors/hooks/useContributorsData"
import Loading from "src/core/components/Loading"
import { CurrentUser } from "src/users/queries/getCurrentUser"

interface ContributorListProps {
  privilege: MemberPrivileges
  currentUser: CurrentUser
  projectId: number
}

export const ContributorList = ({ privilege, currentUser, projectId }: ContributorListProps) => {
  const contributorTableData = useContributorsData(privilege, currentUser, projectId)

  const tableColumns =
    privilege === MemberPrivileges.CONTRIBUTOR
      ? StandardContributorColumns
      : ProjectManagerContributorColumns

  return (
    <Suspense fallback={<Loading />}>
      <Table columns={tableColumns} data={contributorTableData} addPagination={true} />
    </Suspense>
  )
}

const ContributorsPage = () => {
  const projectId = useParam("projectId", "number")
  const { privilege } = useMemberPrivileges()
  const currentUser = useCurrentUser()

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="All Contributors">
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2 text-3xl">Contributors</h1>
        <Suspense fallback={<Loading />}>
          <ContributorList
            privilege={privilege!}
            currentUser={currentUser!}
            projectId={projectId!}
          />
        </Suspense>
        {privilege === MemberPrivileges.PROJECT_MANAGER && (
          <div>
            <Link
              className="btn btn-primary mb-4 mt-4"
              href={Routes.NewContributorPage({ projectId: projectId! })}
            >
              Invite Contributor
            </Link>
            <Link
              className="btn btn-secondary mx-2 mb-4 mt-4"
              href={Routes.InvitesPagePM({ projectId: projectId! })}
            >
              View Invitations
            </Link>
          </div>
        )}
      </main>
    </Layout>
  )
}

export default ContributorsPage
