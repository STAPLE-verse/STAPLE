import { Routes } from "@blitzjs/next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { FormElementSchema } from "src/elements/schemas"
import createElement from "src/elements/mutations/createElement"
import { ElementForm, FORM_ERROR } from "src/elements/components/ElementForm"
import { Suspense } from "react"
import { useParam } from "@blitzjs/next"
import getProject from "src/projects/queries/getProject"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"
import toast from "react-hot-toast"

const NewElementPage = () => {
  const router = useRouter()
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })
  const sidebarItems = ProjectSidebarItems(projectId!, "Dashboard")
  const [createElementMutation] = useMutation(createElement)

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
      <Head>
        <title>Create New Element</title>
      </Head>
      <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
        <h1 className="text-3xl">Create New Element</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <ElementForm
            submitText="Create Element"
            schema={FormElementSchema}
            // initialValues={{}}
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
