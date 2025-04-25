"use client"

import { Suspense } from "react"
import Head from "next/head"

import Layout from "src/core/layouts/Layout"

import React from "react"
import FormPlayground from "src/forms/components/FormPlayground"
import { useMutation, useQuery } from "@blitzjs/rpc"
import router from "next/router"
import { Routes, useParam } from "@blitzjs/next"
import updateForm from "src/forms/mutations/updateForm"
import getForm from "src/forms/queries/getForm"

const FormEditPage = () => {
  const [UpdateFormMutation] = useMutation(updateForm)
  const formsId = useParam("formsId", "number")
  const [currentForm, { refetch: refetchGetForm }] = useQuery(getForm, { id: formsId! })

  const saveForm = async (state) => {
    await UpdateFormMutation({
      id: formsId!,
      schema: state.schema,
      uiSchema: state.uischema,
    })

    await refetchGetForm()
    await router.push(Routes.AllFormsPage())
  }

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Form Builder">
      <main className="flex flex-col mx-auto w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <FormPlayground
            saveForm={saveForm}
            initialSchema={JSON.stringify(currentForm.formVersion?.schema || {})}
            initialUiSchema={JSON.stringify(currentForm.formVersion?.uiSchema || {})}
          />
        </Suspense>
      </main>
    </Layout>
  )
}

export default FormEditPage
