"use client"

import { Suspense } from "react"
import Head from "next/head"

import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"

import React from "react"
import { FormPlayground } from "src/forms/components/FormPlayground"
import { useMutation } from "@blitzjs/rpc"
import createForm from "src/forms/mutations/createForm"
import router from "next/router"
import { Routes } from "@blitzjs/next"

const FormBuilderPage = () => {
  const [CreateFormMutation] = useMutation(createForm)
  const currentUser = useCurrentUser()

  const saveForm = async (state) => {
    const form = await CreateFormMutation({
      schema: JSON.parse(state.schema),
      uiSchema: JSON.parse(state.uischema),
      userId: currentUser!.id,
    })
    await router.push(Routes.AllFormsPage())
  }

  return (
    <Layout>
      <Head>
        <title>Form Builder</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <Suspense fallback={<div>Loading...</div>}>
          <FormPlayground saveForm={saveForm} />
        </Suspense>
      </main>
    </Layout>
  )
}

export default FormBuilderPage
