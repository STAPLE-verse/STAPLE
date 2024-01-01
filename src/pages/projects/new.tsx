import { Routes } from "@blitzjs/next"
import { useRouter } from "next/router"
import { useMutation } from "@blitzjs/rpc"
import Layout from "src/core/layouts/Layout"
import { FormProjectSchema } from "src/projects/schemas"
import createProject from "src/projects/mutations/createProject"
import { ProjectForm, FORM_ERROR } from "src/projects/components/ProjectForm"
import { Suspense } from "react"
import { HomeSidebarItems } from "src/core/layouts/SidebarItems"

const NewProjectPage = () => {
  const router = useRouter()
  const [createProjectMutation] = useMutation(createProject)
  const sidebarItems = HomeSidebarItems("Projects")

  return (
    <Layout title={"Create New Project"} sidebarItems={sidebarItems}>
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2">Create New Project</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectForm
            submitText="Create Project"
            schema={FormProjectSchema}
            cancelText="Cancel"
            onCancel={() => router.push(Routes.ProjectsPage())}
            onSubmit={async (values) => {
              try {
                const project = await createProjectMutation(values)
                await router.push(Routes.ShowProjectPage({ projectId: project.id }))
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

NewProjectPage.authenticate = true

export default NewProjectPage
