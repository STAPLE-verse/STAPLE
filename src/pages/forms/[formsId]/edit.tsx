"use client"
import { Suspense } from "react"
import Layout from "src/core/layouts/Layout"
import React from "react"
import FormPlayground from "src/forms/components/FormPlayground"
import { useMutation, useQuery } from "@blitzjs/rpc"
import toast from "react-hot-toast"
import router from "next/router"
import { Routes, useParam } from "@blitzjs/next"
import { useRouter } from "next/router"
import updateForm from "src/forms/mutations/updateForm"
import getForm from "src/forms/queries/getForm"

const FormEditPage = () => {
  const [UpdateFormMutation] = useMutation(updateForm)
  const formsId = useParam("formsId", "number")
  const { query } = useRouter()
  const infoOnly = query.view === "info"
  const [currentForm, { refetch: refetchGetForm }] = useQuery(getForm, { id: formsId! })

  const autoSave = async (state) => {
    try {
      await UpdateFormMutation({
        id: formsId!,
        schema: state.schema,
        uiSchema: state.uischema,
      })
      await refetchGetForm()
      toast.success("Auto-saved.", { duration: 1500 })
    } catch {
      toast.error("Auto-save failed.")
    }
  }

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
            formId={formsId}
            initialTags={Array.isArray(currentForm.tags) ? (currentForm.tags as string[]) : []}
            initialFolderId={currentForm.folderId ?? null}
            versions={currentForm.versions ?? []}
            currentVersionId={currentForm.formVersion?.id ?? currentForm.versions?.[0]?.id}
            formArchived={currentForm.archived}
            infoOnly={infoOnly}
            onAutoSave={autoSave}
            onVersionsUpdated={refetchGetForm}
          />
        </Suspense>
      </main>
    </Layout>
  )
}

export default FormEditPage
