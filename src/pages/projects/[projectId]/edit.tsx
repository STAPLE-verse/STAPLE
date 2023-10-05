import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import deleteProject from "src/projects/mutations/deleteProject"
import { UpdateProjectSchema } from "src/projects/schemas"
import getProject from "src/projects/queries/getProject"
import updateProject from "src/projects/mutations/updateProject"
import { ProjectForm, FORM_ERROR } from "src/projects/components/ProjectForm"
import ProjectLayout from "src/core/layouts/ProjectLayout"

export const EditProject = () => {
  const router = useRouter()

  const projectId = useParam("projectId", "number")
  const [project, { setQueryData }] = useQuery(
    getProject,
    { id: projectId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )

  const [updateProjectMutation] = useMutation(updateProject)
  const [deleteProjectMutation] = useMutation(deleteProject)

  const initialValues = {
    id: project.id,
    name: project.name,
    description: project.description!,
  }

  return (
    <>
      <Head>
        <title>Edit {project.name}</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2">Project Settings</h1>
        <Suspense fallback={<div>Loading...</div>}>
          {/* TODO: Add notification popup if project is updated */}
          <ProjectForm
            submitText="Update Project"
            schema={UpdateProjectSchema}
            initialValues={initialValues}
            onSubmit={async (values) => {
              try {
                const updated = await updateProjectMutation({
                  // id: project.id,
                  ...values,
                })
                await setQueryData(updated)
                await router.push(Routes.ShowProjectPage({ projectId: updated.id }))
              } catch (error: any) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />

          <div className="flex justify-end">
            <button
              type="button"
              className="btn"
              onClick={async () => {
                if (
                  window.confirm(
                    "The project will be permanently deleted. Are you sure to continue?"
                  )
                ) {
                  await deleteProjectMutation({ id: project.id })
                  await router.push(Routes.ProjectsPage())
                }
              }}
            >
              Delete project
            </button>
          </div>
        </Suspense>
      </main>
    </>
  )
}

const EditProjectPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditProject />
      </Suspense>
    </div>
  )
}

EditProjectPage.authenticate = true
EditProjectPage.getLayout = (page) => (
  <Layout>
    <ProjectLayout>{page}</ProjectLayout>
  </Layout>
)

export default EditProjectPage
