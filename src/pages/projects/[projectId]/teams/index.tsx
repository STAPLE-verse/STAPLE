import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"
import Layout from "src/core/layouts/Layout"
import getTeams from "src/teams/queries/getTeams"
import {
  TeamInformation,
  contributorTeamTableColumns,
  pmTeamTableColumns,
} from "src/teams/components/TeamTable"
import Table from "src/core/components/Table"
import { useContributorPrivilege } from "src/contributors/components/ContributorPrivilegeContext"
import { ContributorPrivileges } from "@prisma/client"
import { useCurrentContributor } from "src/contributors/hooks/useCurrentContributor"

const ITEMS_PER_PAGE = 7

interface AllTeamListProps {
  privilege: ContributorPrivileges
}

export const AllTeamList = ({ privilege }: AllTeamListProps) => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const projectId = useParam("projectId", "number")
  const { contributor: currentContributor } = useCurrentContributor(projectId)

  const [{ teams, hasMore }] = usePaginatedQuery(getTeams, {
    where: { project: { id: projectId! } },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
    include: {
      contributors: true,
    },
  })

  const goToPreviousPage = () => router.push({ query: { projectId: projectId, page: page - 1 } })
  const goToNextPage = () => router.push({ query: { projectId: projectId, page: page + 1 } })

  // Filter teams if the privilege is CONTRIBUTOR
  const filteredTeams =
    privilege === ContributorPrivileges.CONTRIBUTOR
      ? teams.filter((team) =>
          team.contributors.some((contributor) => contributor.id === currentContributor?.id)
        )
      : teams

  let teamInformation: TeamInformation[] = filteredTeams.map((team) => {
    let t: TeamInformation = {
      name: team.name,
      id: team.id,
      projectId: projectId,
    }
    return t
  })

  const tableColumns =
    privilege === ContributorPrivileges.CONTRIBUTOR
      ? contributorTeamTableColumns
      : pmTeamTableColumns

  return (
    <div>
      <Table columns={tableColumns} data={teamInformation} />
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
    </div>
  )
}

// Issue 37
const TeamsPage = () => {
  const projectId = useParam("projectId", "number")
  const { privilege } = useContributorPrivilege()

  return (
    <Layout>
      <Head>
        <title>All Teams</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2 text-3xl">Teams</h1>

        {
          <Suspense fallback={<div>Loading...</div>}>
            <AllTeamList privilege={privilege!} />
          </Suspense>
        }
        {privilege === ContributorPrivileges.PROJECT_MANAGER && (
          <div>
            <Link
              className="btn btn-primary mb-4"
              href={Routes.NewTeamPage({ projectId: projectId! })}
            >
              Add Team
            </Link>
          </div>
        )}
      </main>
    </Layout>
  )
}

export default TeamsPage
