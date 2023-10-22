import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"

import Layout from "src/core/layouts/Layout"
import getContributors from "src/contributors/queries/getContributors"
import ProjectLayout from "src/core/layouts/ProjectLayout"
import { getInitials } from "src/services/getInitials"

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
                  <p>
                    {firstName} {lastName}
                  </p>
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

  return (
    <>
      <Head>
        <title>Contributors</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2">Contributors</h1>
        <Link className="btn mb-4" href={Routes.NewContributorPage({ projectId: projectId! })}>
          Add contributor
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="h-6 w-6"
            viewBox="0 0 16 16"
          >
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
        </Link>

        <Suspense fallback={<div>Loading...</div>}>
          <ContributorsList />
        </Suspense>
      </main>
    </>
  )
}

ContributorsPage.getLayout = (page) => (
  <Layout>
    <ProjectLayout>{page}</ProjectLayout>
  </Layout>
)

export default ContributorsPage
