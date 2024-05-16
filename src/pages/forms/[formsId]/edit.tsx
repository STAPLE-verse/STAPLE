"use client"

import { Suspense } from "react"
import Head from "next/head"

import Layout from "src/core/layouts/Layout"
import { HomeSidebarItems } from "src/core/layouts/SidebarItems"

import React from "react"
import { FormPlayground } from "src/forms/components/FormPlayground"
import { useMutation, useQuery } from "@blitzjs/rpc"
import router from "next/router"
import { Routes, useParam } from "@blitzjs/next"
import updateForm from "src/forms/mutations/updateForm"
import getForm from "src/forms/queries/getForm"

const FormEditPage = () => {
  const sidebarItems = HomeSidebarItems("Forms")
  const [UpdateFormMutation] = useMutation(updateForm)
  const formsId = useParam("formsId", "number")
  const [currentForm] = useQuery(getForm, { id: formsId! })
  const saveForm = async (state) => {
    const form = await UpdateFormMutation({
      id: formsId!,
      schema: JSON.parse(state.schema),
      uiSchema: JSON.parse(state.uischema),
    })
    await router.push(Routes.AllFormsPage())
  }

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle="Home">
      <Head>
        <title>Form Builder</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <Suspense fallback={<div>Loading...</div>}>
          <FormPlayground
            saveForm={saveForm}
            initialSchema={JSON.stringify(currentForm?.schema || {})}
            initialUiSchema={JSON.stringify(currentForm?.uiSchema || {})}
          />
        </Suspense>
      </main>
    </Layout>
  )
}

export default FormEditPage
