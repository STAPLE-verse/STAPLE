import { Routes } from "@blitzjs/next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { FormElementSchema } from "src/elements/schemas"
import createElement from "src/elements/mutations/createElement"
import { ElementForm } from "src/elements/components/ElementForm"
import { FORM_ERROR } from "final-form"
import { Suspense } from "react"
import { useParam } from "@blitzjs/next"
import toast from "react-hot-toast"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import PageHeader from "src/core/components/PageHeader"

const NewElementPage = () => {
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])
  const router = useRouter()
  const projectId = useParam("projectId", "number")
  const [createElementMutation] = useMutation(createElement)

  return (
    <Layout title="Create New Element">
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <PageHeader title="Create New Element" />
        <Suspense fallback={<div>Loading...</div>}>
          <ElementForm
            submitText="Create Element"
            schema={FormElementSchema}
            onSubmit={async (values) => {
              try {
                const element = await createElementMutation({ ...values, projectId: projectId! })
                await toast.promise(Promise.resolve(element), {
                  loading: "Creating element...",
                  success: "Element created!",
                  error: "Failed to create the element...",
                })
                await router.push(
                  Routes.ShowElementPage({ projectId: projectId!, elementId: element.id })
                )
              } catch (error: any) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />
        </Suspense>
      </main>
    </Layout>
  )
}

NewElementPage.authenticate = true

export default NewElementPage
