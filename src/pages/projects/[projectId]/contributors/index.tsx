import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"

import Layout from "src/core/layouts/Layout"
import getContributors from "src/contributors/queries/getContributors"

const ITEMS_PER_PAGE = 100

export const ContributorsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const projectId = useParam("projectId", "number")
  const [{ contributors, hasMore }] = usePaginatedQuery(getContributors, {
    where: { project: { id: projectId! } },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {contributors.map((contributor) => (
          <li key={contributor.id}>
            <Link
              href={Routes.ShowContributorPage({
                contributorId: contributor.id,
              })}
            >
              {contributor.name}
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const ContributorsPage = () => {
  const projectId = useParam("projectId", "number")

  return (
    <Layout>
      <Head>
        <title>Contributors</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewContributorPage({ projectId: projectId! })}>
            Create Contributor
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <ContributorsList />
        </Suspense>
      </div>
    </Layout>
  )
}

export default ContributorsPage
