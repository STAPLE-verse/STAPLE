import { Suspense, useState } from "react"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { setQueryData, useMutation, useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import getProjectData from "src/summary/queries/getProjectData"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import DateFormat from "src/core/components/DateFormat"
import DownloadJSON from "src/forms/components/DownloadJSON"
import { MetadataDisplay } from "src/projects/components/MetaDataDisplay"
import { JsonFormModal } from "src/core/components/JsonFormModal"
import DownloadXLSX from "src/forms/components/DownloadXLSX"
import getJsonSchema from "src/forms/utils/getJsonSchema"
import toast from "react-hot-toast"
import updateProject from "src/projects/mutations/updateProject"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import CollapseCard from "src/core/components/CollapseCard"

const Summary = () => {
  // Get data
  // Get projects
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProjectData, { id: projectId })
  const [updateProjectMutation] = useMutation(updateProject)

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
      await setQueryData(getProjectData, { id: projectId }, (prevData) => {
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
      await setQueryData(getProjectData, { id: projectId }, (prevData) => {
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
    <main className="flex flex-col mx-auto w-full">
      <h1 className="flex justify-center items-center mb-4 text-3xl">
        Project Summary
        <InformationCircleIcon
          className="h-6 w-6 ml-2 text-info stroke-2"
          data-tooltip-id="project-download-tooltip"
        />
        <Tooltip
          id="project-download-tooltip"
          content="You can download information about just the project metadata, all the project data, or launch the project summary interactive viewer."
          className="z-[1099] ourtooltips"
        />
      </h1>
      {/* buttons */}
      <div className="flex flex-row justify-center mb-4">
        {project.metadata && <></>}

        <DownloadJSON
          data={project}
          fileName={`${project.name}`}
          className="mx-2 btn btn-primary"
          label="Download Project JSON"
        />
        <button className="btn btn-secondary">Launch Viewer (coming soon)</button>
      </div>

      {/* Project  information */}
      <CollapseCard title="Project Settings" className="mb-4" defaultOpen={true}>
        Use project settings to change the name, description, and required project metadata.
        <br className="mb-4" />
        Name: {project.name}
        <br />
        Created: <DateFormat date={project.createdAt}></DateFormat>
        <br />
        Last Update: <DateFormat date={project.updatedAt}></DateFormat>
        <br />
        Description: {project.description}
        <div className="card-actions justify-end">
          <Link
            className="btn btn-primary"
            href={Routes.EditProjectPage({ projectId: projectId! })}
          >
            Edit Project Settings
          </Link>
        </div>
      </CollapseCard>
      <CollapseCard title="Project Metadata">
        {project.formVersionId ? (
          <>
            <MetadataDisplay metadata={project.metadata} />
            <div className="justify-end flex">
              <DownloadJSON
                data={project.metadata}
                fileName={project.name}
                className="btn btn-primary"
                type="button"
                label="Download Metadata JSON"
              />
              <DownloadXLSX
                data={project.metadata}
                fileName={project.name}
                className="btn btn-secondary mx-2"
                type="button"
                label="Download Metadata XLSX"
              />
              <JsonFormModal
                schema={getJsonSchema(project.formVersion?.schema)}
                uiSchema={getJsonSchema(project.formVersion?.uiSchema)}
                metadata={project.metadata}
                label={"Edit Project Metadata"}
                classNames="btn-info"
                onSubmit={handleJsonFormSubmit}
                onError={handleJsonFormError}
                resetHandler={handleResetMetadata}
                modalSize="w-11/12 max-w-5xl"
              />
            </div>
          </>
        ) : (
          <div>No metadata available for this project.</div>
        )}
      </CollapseCard>
    </main>
  )
}

const SummaryPage = () => {
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])

  return (
    // @ts-expect-error children are clearly passed below
    <Layout title="Project Summary">
      <Suspense fallback={<div>Loading...</div>}>
        <Summary />
      </Suspense>
    </Layout>
  )
}

export default SummaryPage
function updateProjectMutation(arg0: { id: number; name: string; metadata: any }) {
  throw new Error("Function not implemented.")
}
