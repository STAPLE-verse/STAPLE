import { Suspense } from "react"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import React from "react"
import FormPlayground from "src/forms/components/FormPlayground"
import { useMutation } from "@blitzjs/rpc"
import createForm from "src/forms/mutations/createForm"
import router from "next/router"
import { Routes } from "@blitzjs/next"
import type { FormStudioState } from "@staple-verse/form-studio"

const FormBuilderPage = () => {
  const [CreateFormMutation] = useMutation(createForm)
  const currentUser = useCurrentUser()

  const saveForm = async (state: FormStudioState) => {
    const form = await CreateFormMutation({
      schema: state.schema,
      uiSchema: state.uiSchema,
      userId: currentUser!.id,
    })
    await router.push(Routes.FormEditPage({ formsId: form.id }))
  }

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Form Builder">
      <main className="flex flex-col mx-auto w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <FormPlayground saveForm={saveForm} />
        </Suspense>
      </main>
    </Layout>
  )
}

export default FormBuilderPage
