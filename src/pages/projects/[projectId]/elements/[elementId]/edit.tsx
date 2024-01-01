import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import { UpdateElementSchema } from "src/elements/schemas"
import getElement from "src/elements/queries/getElement"
import updateElement from "src/elements/mutations/updateElement"
import { ElementForm, FORM_ERROR } from "src/elements/components/ElementForm"
import getProject from "src/projects/queries/getProject"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"

export const EditElement = () => {
  const router = useRouter()
  const elementId = useParam("elementId", "number")
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })
  const sidebarItems = ProjectSidebarItems(projectId!, null)
  const [element, { setQueryData }] = useQuery(
    getElement,
    { id: elementId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateElementMutation] = useMutation(updateElement)

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
      <Head>
        <title>Edit Element {element.id}</title>
      </Head>

      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <h1>Edit {element.name}</h1>
        {/* <pre>{JSON.stringify(element, null, 2)}</pre> */}
        <Suspense fallback={<div>Loading...</div>}>
          <ElementForm
            submitText="Update Element"
            schema={UpdateElementSchema}
            initialValues={element}
            onSubmit={async (values) => {
              try {
                const updated = await updateElementMutation({
                  // id: element.id,
                  ...values,
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
            className="btn self-end mt-4"
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
  const projectId = useParam("projectId", "number")

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditElement />
      </Suspense>
    </div>
  )
}

EditElementPage.authenticate = true

export default EditElementPage
