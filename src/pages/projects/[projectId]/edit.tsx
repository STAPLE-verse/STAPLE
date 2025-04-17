import { Suspense, useState } from "react"
import { Routes } from "@blitzjs/next"
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
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import DownloadJSON from "src/forms/components/DownloadJSON"
import DownloadXLSX from "src/forms/components/DownloadXLSX"
import { JsonFormModal } from "src/core/components/JsonFormModal"
import getJsonSchema from "src/forms/utils/getJsonSchema"
import { MetadataDisplay } from "src/projects/components/MetaDataDisplay"
import CollapseCard from "src/core/components/CollapseCard"
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon"
import { Tooltip } from "react-tooltip"

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
    selectedFormVersionId: project.formVersionId,
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

  // get current user for metadata forms
  const currentUser = useCurrentUser()
  if (!currentUser) {
    throw new Error("You must be logged in to access this page.")
  }

  // State to store metadata
  const [assignmentMetadata, setAssignmentMetadata] = useState(project.metadata)

  const handleJsonFormSubmit = async (data) => {
    //console.log("Submitting form data:", data) // Debug log
    try {
      const updatedProject = await updateProjectMutation({
        id: project.id,
        name: project.name,
        metadata: data.formData,
      })

      // Update local state
      setAssignmentMetadata(data.formData)

      // Update the query data to refresh the background
      await setQueryData((prevData) => {
        if (!prevData) {
          throw new Error("No previous data found")
        }

        return {
          ...prevData,
          metadata: updatedProject.metadata,
          formVersion: prevData.formVersion ?? null, // Ensure formVersion is explicitly null if undefined
        }
      })

      toast.success("Form data has been successfully saved!")
    } catch (error) {
      console.error("Failed to save form data:", error)
      toast.error("Failed to save form data. Please try again.")
    }
  }

  const handleJsonFormError = (errors) => {
    console.log(errors)
  }
  // Handle reset metadata
  // Using hard reset to bypass validation
  const handleResetMetadata = async () => {
    try {
      // Reset the metadata to an empty object
      await updateProjectMutation({
        id: project.id,
        name: project.name,
        metadata: {}, // Reset metadata to an empty object
      })

      // Update local state
      setAssignmentMetadata({})

      // Show a success toast
      toast.success("Metadata has been successfully reset!")

      // Refresh the form data
      await setQueryData((prevData) => {
        if (!prevData) {
          throw new Error("No previous data found")
        }

        return {
          ...prevData,
          metadata: {}, // Reset metadata to an empty object
          formVersion: prevData.formVersion ?? null, // Ensure formVersion is explicitly null if undefined
        }
      })
    } catch (error) {
      console.error("Failed to reset metadata:", error)
      toast.error("Failed to reset metadata. Please try again.")
    }
  }

  return (
    <>
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        <h1 className="flex justify-center items-center mb-2 text-3xl">
          Project Settings
          <InformationCircleIcon
            className="h-6 w-6 ml-2 text-info stroke-2"
            data-tooltip-id="project-overview"
          />
          <Tooltip
            id="project-overview"
            content="This page allows you to change the project's name, description, and required metadata form. After updating the required metadata form, use the section below to enter, update, or download the project's metadata."
            className="z-[1099] ourtooltips"
          />
        </h1>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="flex flex-row justify-center mb-4">
            <ProjectForm
              submitText="Update Project"
              schema={FormProjectSchema}
              initialValues={initialValues}
              cancelText="Cancel"
              onCancel={handleCancel}
              onSubmit={handleSubmit}
              userId={currentUser.id}
              formResponseSupplied={initialValues.selectedFormVersionId ? true : false}
            />
          </div>

          <CollapseCard title="Edit, View, and Download Required Form Data">
            {project.formVersion ? (
              <div>
                <div className="flex flex-row justify-center mt-2">
                  <DownloadJSON
                    data={project.metadata}
                    fileName={project.name}
                    className="btn btn-primary"
                    type="button"
                  />
                  <DownloadXLSX
                    data={project.metadata}
                    fileName={project.name}
                    className="btn btn-secondary mx-2"
                    type="button"
                  />
                  <JsonFormModal
                    schema={getJsonSchema(project.formVersion?.schema)}
                    uiSchema={getJsonSchema(project.formVersion?.uiSchema)}
                    metadata={project.metadata ? project.metadata : {}}
                    label={"Edit Form Data"}
                    classNames="btn-info"
                    onSubmit={handleJsonFormSubmit}
                    onError={handleJsonFormError}
                    resetHandler={handleResetMetadata}
                    modalSize="w-11/12 max-w-5xl"
                  />
                </div>

                <div>
                  <MetadataDisplay metadata={project.metadata} />
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-4">
                No form has been created for this project yet.
              </p>
            )}
          </CollapseCard>

          <div className="divider pt-4 pb-4"></div>
          <div className="flex justify-center">
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
    // @ts-expect-error children are clearly passed below
    <Layout title="Edit Project">
      <Suspense fallback={<div>Loading...</div>}>
        <EditProject />
      </Suspense>
    </Layout>
  )
}

EditProjectPage.authenticate = true

export default EditProjectPage
