import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import Layout from "src/core/layouts/Layout"
import { useParam } from "@blitzjs/next"
import getElements from "src/elements/queries/getElements"

import ProjectLayout from "src/core/layouts/ProjectLayout"

const ITEMS_PER_PAGE = 100

export const ElementsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const projectId = useParam("projectId", "number")
  const [{ elements, hasMore }] = usePaginatedQuery(getElements, {
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
        {elements.map((element) => (
          <li key={element.id}>
            <Link href={Routes.ShowElementPage({ projectId: projectId!, elementId: element.id })}>
              {element.name}
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

const ElementsPage = () => {
  const projectId = useParam("projectId", "number")

  return (
    <>
      <Head>
        <title>Elements</title>
      </Head>

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <ElementsList />
        </Suspense>

        <p>
          <Link href={Routes.NewElementPage({ projectId: projectId! })}>Create Element</Link>
        </p>
      </div>
    </>
  )
}

ElementsPage.getLayout = (page) => (
  <Layout>
    <ProjectLayout>{page}</ProjectLayout>
  </Layout>
)
export default ElementsPage
