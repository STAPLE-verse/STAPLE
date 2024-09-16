import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import getContributors from "src/projectmembers/queries/getContributors"
import {
  ContributorInformation,
  pmContributorTableColumns,
  contributorContributorTableColumns,
} from "src/projectmembers/components/ContributorTable"
import Table from "src/core/components/Table"
import { useMemberPrivileges } from "src/projectmembers/components/MemberPrivilegesContext"
import { MemberPrivileges } from "@prisma/client"
import { useCurrentContributor } from "src/projectmembers/hooks/useCurrentContributor"

interface AllContributorsListProps {
  privilege: MemberPrivileges
}

export const AllContributorsList = ({ privilege }: AllContributorsListProps) => {
  const projectId = useParam("projectId", "number")
  const { contributor: currentContributor } = useCurrentContributor(projectId)

  const [{ contributors }] = useQuery(getContributors, {
    where: { project: { id: projectId! } },
    orderBy: { id: "asc" },
    include: {
      user: true,
    },
  })

  const filteredContributors =
    privilege === MemberPrivileges.CONTRIBUTOR
      ? contributors.filter((contributor) => contributor.id === currentContributor?.id)
      : contributors

  let contributorInformation: ContributorInformation[] = filteredContributors.map((contributor) => {
    const firstName = contributor["user"].firstName
    const lastName = contributor["user"].lastName
    const username = contributor["user"].username
    let t: ContributorInformation = {
      name: firstName || lastName ? `${firstName} ${lastName}` : username,
      id: contributor.id,
      projectId: projectId,
    }
    return t
  })

  const tableColumns =
    privilege === MemberPrivileges.CONTRIBUTOR
      ? contributorContributorTableColumns
      : pmContributorTableColumns

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      {/* <h1 className="flex justify-center mb-2">All Contributors</h1> */}
      <Table columns={tableColumns} data={contributorInformation} addPagination={true} />
    </main>
  )
}
// issue 37
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
          <AllContributorsList privilege={privilege!} />
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
