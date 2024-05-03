"use client"

import { Suspense, useEffect, useState } from "react"
import Head from "next/head"
import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"

import Layout from "src/core/layouts/Layout"
import { HomeSidebarItems } from "src/core/layouts/SidebarItems"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

import React, { useRef } from "react"
import ReactDOM from "react-dom"
import { FormBuilder, PredefinedGallery } from "@ginkgo-bioworks/react-json-schema-form-builder"

const Example = () => {
  const [state, setState] = useState({ schema: "{}", uischema: "{}" })
  const [render, setRender] = useState(false)

  useEffect(() => {
    if (!render) {
      setRender(true)
    }

    console.log(state.schema)
  }, [])

  // TODO: This logs a lot - remove
  useEffect(() => {
    console.log(state.schema)
  })

  return render ? (
    <FormBuilder
      schema={state.schema}
      uischema={state.uischema}
      mods={{}}
      onChange={(newSchema, newUiSchema) => {
        setState({
          schema: newSchema,
          uischema: newUiSchema,
        })
      }}
    />
  ) : null
}

const FormBuilderPage = () => {
  const sidebarItems = HomeSidebarItems("Forms")
  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle="Home">
      <Head>
        <title>Form Builder</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <Suspense fallback={<div>Loading...</div>}>
          <Example />
        </Suspense>
      </main>
    </Layout>
  )
}

export default FormBuilderPage
