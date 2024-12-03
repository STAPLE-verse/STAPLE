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
import { ProjectForm } from "src/projects/components/ProjectForm"
import { FORM_ERROR } from "final-form"
import toast from "react-hot-toast"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"

export const EditProject = () => {
  // Setup
  const router = useRouter()
  const [updateProjectMutation] = useMutation(updateProject)
  const [deleteProjectMutation] = useMutation(deleteProject)

  // Get project
  const projectId = useParam("projectId", "number")
  const [project, { setQueryData }] = useQuery(
    getProject,
    { id: projectId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )

  // Define initial values for the form
  const initialValues = {
    name: project.name,
    description: project.description!,
    abstract: project.abstract!,
    keywords: project.keywords!,
    citation: project.citation!,
    publisher: project.publisher!,
    identifier: project.identifier!,
  }

  // Handle events
  const handleDelete = async () => {
    if (window.confirm("The project will be permanently deleted. Are you sure to continue?")) {
      try {
        await router.push(Routes.ProjectsPage())
        await toast.promise(deleteProjectMutation({ id: project.id }), {
          loading: "Deleting project...",
          success: "Project deleted!",
          error: "Failed to delete the project...",
        })
      } catch (error: any) {
        console.error("Failed to delete the project:", error)
      }
    }
  }

  const handleCancel = async () => {
    await router.push(Routes.ShowProjectPage({ projectId: projectId! }))
  }

  const handleSubmit = async (values: any) => {
    try {
      const updated = await updateProjectMutation({
        id: project.id,
        ...values,
      })

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
  }

  return (
    <>
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center mb-2 text-3xl">Project Settings</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectForm
            submitText="Update Project"
            schema={FormProjectSchema}
            initialValues={initialValues}
            cancelText="Cancel"
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />

          <div className="flex justify-end mt-4">
            <button type="button" className="btn btn-warning" onClick={handleDelete}>
              Delete project
            </button>
          </div>
        </Suspense>
      </main>
    </>
  )
}

const EditProjectPage = () => {
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])

  return (
    <Layout title="Edit Project">
      <Suspense fallback={<div>Loading...</div>}>
        <EditProject />
      </Suspense>
    </Layout>
  )
}

EditProjectPage.authenticate = true

export default EditProjectPage
