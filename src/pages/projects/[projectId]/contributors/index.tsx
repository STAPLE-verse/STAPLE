import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import {
  pmContributorTableColumns,
  contributorTableColumns,
} from "src/contributors/components/ContributorTable"
import Table from "src/core/components/Table"
import { useMemberPrivileges } from "src/projectprivileges/components/MemberPrivilegesContext"
import { MemberPrivileges } from "@prisma/client"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { processContributorTableData } from "src/contributors/utils/processContributorTableData"
import getContributors, { ContributorWithUser } from "src/contributors/queries/getContributors"

interface ContributorListProps {
  privilege: MemberPrivileges
}

export const ContributorList = ({ privilege }: ContributorListProps) => {
  const projectId = useParam("projectId", "number")
  const currentUser = useCurrentUser()

  const [contributors] = useQuery(getContributors, { projectId: projectId! })

  const filteredContributors =
    privilege === MemberPrivileges.CONTRIBUTOR
      ? contributors.filter(
          (contributor: ContributorWithUser) =>
            contributor.users.length === 1 && contributor.users[0]?.id === currentUser?.id
        )
      : contributors

  const contributorTableData = processContributorTableData(filteredContributors, projectId!)

  const tableColumns =
    privilege === MemberPrivileges.CONTRIBUTOR ? contributorTableColumns : pmContributorTableColumns

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <Table columns={tableColumns} data={contributorTableData} addPagination={true} />
    </main>
  )
}

const ContributorsPage = () => {
  const projectId = useParam("projectId", "number")
  const { privilege } = useMemberPrivileges()

  return (
    <Layout>
      <Head>
        <title>All Contributors</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2 text-3xl">Contributors</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <ContributorList privilege={privilege!} />
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
