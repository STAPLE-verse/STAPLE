import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import deleteProject from "src/projects/mutations/deleteProject"
import { FormProjectSchema } from "src/projects/schemas"
import getProject from "src/projects/queries/getProject"
import updateProject from "src/projects/mutations/updateProject"
import { ProjectForm, FORM_ERROR } from "src/projects/components/ProjectForm"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"
import toast from "react-hot-toast"

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
    name: project.name,
    description: project.description!,
    abstract: project.abstract!,
    keywords: project.keywords!,
    citation: project.citation!,
    publisher: project.publisher!,
    identifier: project.identifier!,
  }

  const sidebarItems = ProjectSidebarItems(projectId!, null)

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
      <Head>
        <title>Edit {project.name}</title>
      </Head>

      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2 text-3xl">Project Settings</h1>
        <Suspense fallback={<div>Loading...</div>}>
          {/* TODO: Add notification popup if project is updated */}
          <ProjectForm
            submitText="Update Project"
            schema={FormProjectSchema}
            initialValues={initialValues}
            cancelText="Cancel"
            onCancel={() => router.push(Routes.ShowProjectPage({ projectId: projectId! }))}
            onSubmit={async (values) => {
              try {
                const updated = await updateProjectMutation({
                  id: project.id,
                  ...values,
                })
                //console.log(updated)

                await toast.promise(Promise.resolve(updated), {
                  loading: "Updating project...",
                  success: "Project updated!",
                  error: "Failed to update the project...",
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

          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="btn"
              onClick={async () => {
                if (
                  window.confirm(
                    "The project will be permanently deleted. Are you sure to continue?"
                  )
                ) {
                  await toast.promise(deleteProjectMutation({ id: project.id }), {
                    loading: "Deleting project...",
                    success: () => {
                      router.push(Routes.ProjectsPage()).catch((e) => console.log(e.message))
                      return `Deleted project!`
                    },
                    error: "Failed to delete submission...",
                  })
                }
              }}
            >
              Delete project
            </button>
          </div>
        </Suspense>
      </main>
    </Layout>
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

export default EditProjectPage
