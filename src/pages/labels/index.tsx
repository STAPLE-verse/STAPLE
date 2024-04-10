import { Suspense } from "react"
import Head from "next/head"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"

import Layout from "src/core/layouts/Layout"
import { HomeSidebarItems } from "src/core/layouts/SidebarItems"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

import React, { useRef } from "react"
import ReactDOM from "react-dom"
import { ReactFormBuilder } from "staple-form-builder"
import "staple-form-builder/dist/app.css"

const LabelBuilderPage = () => {
  const sidebarItems = HomeSidebarItems("Labels")

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle="Home">
      <Head>
        <title>Contribution Labels</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <Suspense fallback={<div>Loading...</div>}>
          Label creation and updating will go here
        </Suspense>
      </main>
    </Layout>
  )
}

export default LabelBuilderPage
