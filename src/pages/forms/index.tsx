import { Suspense } from "react"
import Head from "next/head"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"

import Layout from "src/core/layouts/Layout"
import getForms from "src/forms/queries/getForms"
import { HomeSidebarItems } from "src/core/layouts/SidebarItems"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import Table from "src/core/components/Table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { AllFormsList } from "src/forms/components/AllFormsList"

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
