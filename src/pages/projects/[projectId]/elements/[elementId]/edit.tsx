import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import { FormElementSchema } from "src/elements/schemas"
import getElement from "src/elements/queries/getElement"
import updateElement from "src/elements/mutations/updateElement"
import { ElementForm } from "src/elements/components/ElementForm"
import { FORM_ERROR } from "final-form"

import toast from "react-hot-toast"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import PageHeader from "src/core/components/PageHeader"

export const EditElement = () => {
  const [updateElementMutation] = useMutation(updateElement)
  const router = useRouter()
  const elementId = useParam("elementId", "number")
  const projectId = useParam("projectId", "number")
  const [element, { setQueryData }] = useQuery(
    getElement,
    { id: elementId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )

  const initialValues = {
    name: element.name,
    description: element.description,
  }

  return (
    <Layout title="Edit Element Page">
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <PageHeader title={`Edit ${element.name}`} />
        <Suspense fallback={<div>Loading...</div>}>
          <ElementForm
            submitText="Update Element"
            schema={FormElementSchema}
            initialValues={initialValues}
            onSubmit={async (values) => {
              try {
                const updated = await updateElementMutation({
                  id: element.id,
                  ...values,
                })
                await toast.promise(Promise.resolve(updated), {
                  loading: "Updating element...",
                  success: "Element updated!",
                  error: "Failed to update the element...",
                })
                await setQueryData(updated)
                await router.push(
                  Routes.ShowElementPage({ projectId: projectId!, elementId: updated.id })
                )
              } catch (error: any) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />
          <Link
            className="btn btn-secondary self-end mt-4"
            href={Routes.ShowElementPage({ projectId: projectId!, elementId: elementId! })}
          >
            Cancel
          </Link>
        </Suspense>
      </main>
    </Layout>
  )
}

const EditElementPage = () => {
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditElement />
    </Suspense>
  )
}

EditElementPage.authenticate = true

export default EditElementPage
