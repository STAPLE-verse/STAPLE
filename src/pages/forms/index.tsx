import { Suspense } from "react"
import Head from "next/head"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"

import Layout from "src/core/layouts/Layout"
import getForms from "src/forms/queries/getForms"
import { HomeSidebarItems } from "src/core/layouts/SidebarItems"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import Table from "src/core/components/Table"
import { formsTableColumns } from "src/forms/components/FormsTable"
import Link from "next/link"
import { Routes } from "@blitzjs/next"

const ITEMS_PER_PAGE = 100

export const AllFormsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const currentUser = useCurrentUser()

  const [{ forms, hasMore }] = usePaginatedQuery(getForms, {
    where: {
      user: { id: currentUser?.id },
    },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  // const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  // const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">All Forms</h1>
      <Table columns={formsTableColumns} data={forms} />
    </main>
  )
}

const AllFormsPage = () => {
  const sidebarItems = HomeSidebarItems("Forms")

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle="Home">
      <Head>
        <title>All Forms</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <Suspense fallback={<div>Loading...</div>}>
          <AllFormsList />
        </Suspense>
        <div className="flex justify-start">
          <Link className="btn btn-primary" href={Routes.FormBuilderPage()}>
            Create Form
          </Link>
        </div>
      </main>
    </Layout>
  )
}

export default AllFormsPage
