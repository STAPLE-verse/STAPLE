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
          <br />
          - make this like the task table - where you can view all Labels with a view button that
          opens a modal that allows you to edit or delete the label in case of misspellings
          <br />
          - at the bottom of the paged table have a "create" button that opens a modal that allows
          you to add a new Label
          <br />- new label page should have string fields for name, description, and taxonomy
        </Suspense>
      </main>
    </Layout>
  )
}

export default LabelBuilderPage
