import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery, useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"

import Layout from "src/core/layouts/Layout"
import getProject from "src/projects/queries/getProject"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"
import { PlusIcon } from "@heroicons/react/24/outline"
import getTeams from "src/teams/queries/getTeams"

const ITEMS_PER_PAGE = 7

export const TeamList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const projectId = useParam("projectId", "number")
  const [{ teams, hasMore }] = usePaginatedQuery(getTeams, {
    where: { project: { id: projectId! } },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div className="">
      {teams.map((team) => {
        return (
          <div className="card bg-base-200 mb-2" key={team.id}>
            <div className="card-body flex flex-row justify-between">
              <div className="flex items-center">
                <div className="text-2xl ml-4">
                  <p>{team.name}</p>
                </div>
              </div>
              <div className="justify-end">
                <Link
                  className="btn"
                  href={Routes.ShowTeamPage({
                    projectId: projectId!,
                    teamId: team.id,
                  })}
                >
                  See Team
                </Link>
              </div>
            </div>
          </div>
        )
      })}

      <div className="join grid grid-cols-2 mt-4">
        <button
          className="join-item btn btn-outline"
          disabled={page === 0}
          onClick={goToPreviousPage}
        >
          Previous
        </button>
        <button className="join-item btn btn-outline" disabled={!hasMore} onClick={goToNextPage}>
          Next
        </button>
      </div>
    </div>
  )
}

const TeamsPage = () => {
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })
  const sidebarItems = ProjectSidebarItems(projectId!, "Teams")

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
      <Head>
        <title>Teams</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2">Teams</h1>

        <Link className="btn mb-4" href={Routes.NewTeamPage({ projectId: projectId! })}>
          Add Team
          <PlusIcon className="w-5 h-5" />
        </Link>

        {
          <Suspense fallback={<div>Loading...</div>}>
            <TeamList />
          </Suspense>
        }
      </main>
    </Layout>
  )
}

export default TeamsPage
