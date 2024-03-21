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

const FormBuilderPage = () => {
  const sidebarItems = HomeSidebarItems("Forms")
  const formBuilderRef = useRef()
  const handleSave = () => {
    // Access the built JSON form data
    const formData = formBuilderRef.current.getData()
    console.log("Built JSON Form Data:", formData)
  }
  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle="Home">
      <Head>
        <title>Form Builder</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <Suspense fallback={<div>Loading...</div>}>
          <ReactFormBuilder ref={formBuilderRef} />
          <button onClick={handleSave}>Save Form Data</button>
        </Suspense>
      </main>
    </Layout>
  )
}

export default FormBuilderPage
