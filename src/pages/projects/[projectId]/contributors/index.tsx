import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery, useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"

import Layout from "src/core/layouts/Layout"
import getContributors from "src/contributors/queries/getContributors"
import { getInitials } from "src/services/getInitials"
import getProject from "src/projects/queries/getProject"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"
import { PlusIcon } from "@heroicons/react/24/outline"

const ITEMS_PER_PAGE = 7

export const ContributorsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const projectId = useParam("projectId", "number")
  const [{ contributors, hasMore }] = usePaginatedQuery(getContributors, {
    where: { project: { id: projectId! } },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
    include: {
      user: true,
    },
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      {contributors.map((contributor) => {
        const firstName = contributor["user"].firstName
        const lastName = contributor["user"].lastName
        const username = contributor["user"].username
        const initial = getInitials(firstName, lastName)

        return (
          <div className="card bg-base-200 mb-2" key={contributor.id}>
            <div className="card-body flex flex-row justify-between">
              <div className="flex items-center">
                <div className="avatar placeholder">
                  <div className="w-12 rounded-full bg-neutral-focus text-neutral-content">
                    <span className="text-1xl">{initial ? initial : "?"}</span>
                  </div>
                </div>
                <div className="text-2xl ml-4">
                  <p>{firstName || lastName ? `${firstName} ${lastName}` : username}</p>
                </div>
              </div>
              <div className="justify-end">
                <Link
                  className="btn"
                  href={Routes.ShowContributorPage({
                    projectId: projectId!,
                    contributorId: contributor.id,
                  })}
                >
                  See contributions
                </Link>
              </div>
            </div>
          </div>
        )
      })}

      {/* Previous and next page btns */}
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

const ContributorsPage = () => {
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })
  const sidebarItems = ProjectSidebarItems(projectId!, "Contributors")

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
      <Head>
        <title>Contributors</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2">Contributors</h1>
        <Link className="btn mb-4" href={Routes.NewContributorPage({ projectId: projectId! })}>
          Add contributor
          <PlusIcon className="w-5 h-5" />
        </Link>

        <Suspense fallback={<div>Loading...</div>}>
          <ContributorsList />
        </Suspense>
      </main>
    </Layout>
  )
}

export default ContributorsPage