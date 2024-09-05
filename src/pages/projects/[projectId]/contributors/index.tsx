import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"
import Layout from "src/core/layouts/Layout"
import getContributors from "src/contributors/queries/getContributors"
import {
  ContributorInformation,
  pmContributorTableColumns,
  contributorContributorTableColumns,
} from "src/contributors/components/ContributorTable"
import Table from "src/core/components/Table"
import { useContributorPrivilege } from "src/contributors/components/ContributorPrivilegeContext"
import { ContributorPrivileges } from "@prisma/client"
import { useCurrentContributor } from "src/contributors/hooks/useCurrentContributor"

const ITEMS_PER_PAGE = 7

interface AllContributorsListProps {
  privilege: ContributorPrivileges
}

export const AllContributorsList = ({ privilege }: AllContributorsListProps) => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const projectId = useParam("projectId", "number")
  const { contributor: currentContributor } = useCurrentContributor(projectId)

  const [{ contributors, hasMore }] = usePaginatedQuery(getContributors, {
    where: { project: { id: projectId! } },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
    include: {
      user: true,
    },
  })

  const goToPreviousPage = () => router.push({ query: { projectId: projectId, page: page - 1 } })
  const goToNextPage = () => router.push({ query: { projectId: projectId, page: page + 1 } })

  const filteredContributors =
    privilege === ContributorPrivileges.CONTRIBUTOR
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
    privilege === ContributorPrivileges.CONTRIBUTOR
      ? contributorContributorTableColumns
      : pmContributorTableColumns

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      {/* <h1 className="flex justify-center mb-2">All Contributors</h1> */}
      <Table columns={tableColumns} data={contributorInformation} />
      <div className="join grid grid-cols-2 my-6">
        <button
          className="join-item btn btn-secondary"
          disabled={page === 0}
          onClick={goToPreviousPage}
        >
          Previous
        </button>
        <button className="join-item btn btn-secondary" disabled={!hasMore} onClick={goToNextPage}>
          Next
        </button>
      </div>
    </main>
  )
}
// issue 37
const ContributorsPage = () => {
  const projectId = useParam("projectId", "number")
  const { privilege } = useContributorPrivilege()

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
        {privilege === ContributorPrivileges.PROJECT_MANAGER && (
          <div>
            <Link
              className="btn btn-primary mb-4"
              href={Routes.NewContributorPage({ projectId: projectId! })}
            >
              Invite Contributor
            </Link>

            <Link
              className="btn btn-secondary mx-2 mb-4"
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
