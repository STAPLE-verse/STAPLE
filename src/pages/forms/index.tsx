import { Suspense } from "react"
import Head from "next/head"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"

import Layout from "src/core/layouts/Layout"
import { HomeSidebarItems } from "src/core/layouts/SidebarItems"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

import React from "react"
import ReactDOM from "react-dom"
import { ReactFormBuilder } from "staple-form-builder"
import { DemoBar } from "staple-form-builder"
import "staple-form-builder/dist/app.css"

const FormBuilderPage = () => {
  const sidebarItems = HomeSidebarItems("Forms")

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle="Home">
      <Head>
        <title>Form Builder</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <Suspense fallback={<div>Loading...</div>}>
          <DemoBar />
          <ReactFormBuilder />
        </Suspense>
      </main>
    </Layout>
  )
}

export default FormBuilderPage
