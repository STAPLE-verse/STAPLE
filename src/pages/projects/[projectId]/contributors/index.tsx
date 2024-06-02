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
import {
  ContributorInformation,
  contributorTableColumns,
} from "src/contributors/components/ContributorTable"
import Table from "src/core/components/Table"

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
          <div className="card bg-base-300 mb-2" key={contributor.id}>
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
                  className="btn btn-primary"
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

export const AllContributorsList = () => {
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

  let contributorInformation: ContributorInformation[] = contributors.map(
    (contributor) => {
      const firstName = contributor["user"].firstName
      const lastName = contributor["user"].lastName
      const username = contributor["user"].username
      let t: ContributorInformation = {
        name: firstName || lastName ? `${firstName} ${lastName}` : username,
        id: contributor.id,
        projectId: projectId,
      }
      return t
    }

    // name: contributor["user"].firstName
    // const lastName = contributor["user"].lastName
    // const username = contributor["user"].username
    // const initial = getInitials(firstName, lastName)
  )

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      {/* <h1 className="flex justify-center mb-2">All Contributors</h1> */}
      <Table columns={contributorTableColumns} data={contributorInformation} />
    </main>
  )
}
// issue 37
const ContributorsPage = () => {
  const projectId = useParam("projectId", "number")

  return (
    <Layout>
      <Head>
        <title>All Contributors</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2 text-3xl">Contributors</h1>

        {/* <Suspense fallback={<div>Loading...</div>}>
          <ContributorsList />
        </Suspense> */}
        <Suspense fallback={<div>Loading...</div>}>
          <AllContributorsList />
        </Suspense>
        <div>
          <Link
            className="btn btn-secondary mb-4"
            href={Routes.NewContributorPage({ projectId: projectId! })}
          >
            Add Contributor
          </Link>
        </div>
      </main>
    </Layout>
  )
}

export default ContributorsPage
