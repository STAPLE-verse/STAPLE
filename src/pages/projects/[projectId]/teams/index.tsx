import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"

import Layout from "src/core/layouts/Layout"
import getTeams from "src/teams/queries/getTeams"
import { TeamInformation, teamTableColumns } from "src/teams/components/TeamTable"
import Table from "src/core/components/Table"

const ITEMS_PER_PAGE = 7

export const AllTeamList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const projectId = useParam("projectId", "number")
  const [{ teams, hasMore }] = usePaginatedQuery(getTeams, {
    where: { project: { id: projectId! } },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { projectId: projectId, page: page - 1 } })
  const goToNextPage = () => router.push({ query: { projectId: projectId, page: page + 1 } })

  let teamInformation: TeamInformation[] = teams.map((team) => {
    let t: TeamInformation = {
      name: team.name,
      id: team.id,
      projectId: projectId,
    }
    return t
  })

  return (
    <div className="">
      {/* <h1 className="flex justify-center mb-2">All Teams</h1> */}

      <Table columns={teamTableColumns} data={teamInformation} />
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

  return (
    <Layout>
      <Head>
        <title>All Teams</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2 text-3xl">Teams</h1>

        {
          <Suspense fallback={<div>Loading...</div>}>
            <AllTeamList />
          </Suspense>
        }
        <div>
          <Link
            className="btn btn-primary mb-4"
            href={Routes.NewTeamPage({ projectId: projectId! })}
          >
            Add Team
          </Link>
        </div>
      </main>
    </Layout>
  )
}

export default TeamsPage
