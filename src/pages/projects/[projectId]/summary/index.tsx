import { Suspense, useState, useEffect } from "react"
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
import { cleanProjectData } from "src/summary/utils/processProjectData"

const Summary = () => {
  // Get data
  // Get projects
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProjectData, { id: projectId })
  const cleanProject = cleanProjectData(project)
  const [updateProjectMutation] = useMutation(updateProject)

  // Define localStorage key for viewerJobId
  const localStorageKey = `viewerJobId-${projectId}`

  // State to store metadata
  const [assignmentMetadata, setAssignmentMetadata] = useState(project.metadata)
  const [viewerJobId, setViewerJobId] = useState<string | null>(null)
  const [isViewerZipReady, setIsViewerZipReady] = useState(false)
  const [viewerBuildStarted, setViewerBuildStarted] = useState(false)

  useEffect(() => {
    if (!viewerJobId) {
      const savedJobId = localStorage.getItem(localStorageKey)
      if (savedJobId) {
        setViewerJobId(savedJobId)
      }
      return
    }

    const checkZipReady = async () => {
      try {
        const res = await fetch(`/api/viewer-downloads/head?jobId=${viewerJobId}`, {
          method: "HEAD",
        })
        if (res.ok) {
          setIsViewerZipReady(true)
        } else {
          setIsViewerZipReady(false)
        }
      } catch (err) {
        setIsViewerZipReady(false)
      }
    }

    const interval = setInterval(checkZipReady, 3000)
    return () => clearInterval(interval)
  }, [viewerJobId])

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

  // Handler for launching the viewer
  const handleLaunchViewer = async () => {
    try {
      setViewerBuildStarted(true)
      const response = await fetch("/api/build-viewer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanProject),
      })
      if (!response.ok) {
        throw new Error("Failed to launch viewer")
      }
      const data = await response.json()
      setViewerJobId(data.jobId)
      localStorage.setItem(localStorageKey, data.jobId)
      toast.success("Summary build has started!")
      // Optionally handle data or open a new window if a URL is returned
      // if (data.url) window.open(data.url, "_blank");
    } catch (error) {
      console.error(error)
      toast.error("Failed to build summary. Please try again.")
    }
  }

  return (
    <main className="flex flex-col mx-auto w-full text-lg">
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

      <CollapseCard title="Project Settings" className="mb-4" defaultOpen={true}>
        <p>
          This section includes basic project information such as the name, description, and
          creation date. You can also update the project’s settings here.
        </p>
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

      <CollapseCard title="Project Metadata" className="mb-4">
        <p>
          This section displays and allows you to edit the structured metadata associated with your
          project. If your project uses a STAPLE schema, you can view, edit, reset, or download the
          metadata below.
        </p>
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

      <CollapseCard title="Project Summary Viewer" className="mb-4">
        <p>
          Use this section to view and download the complete project summary. You can export the
          full project JSON or launch an interactive viewer (coming soon).
        </p>
        <br className="mb-4" />
        {/* buttons */}
        <div className="card-actions justify-end">
          <DownloadJSON
            data={cleanProject}
            fileName={`${project.name}`}
            className="btn btn-primary"
            label="Download Project JSON"
          />
          <button className="btn btn-secondary" onClick={handleLaunchViewer}>
            Generate Shareable Summary
          </button>
          {viewerBuildStarted && viewerJobId && !isViewerZipReady && (
            <p className="text-sm text-gray-500 mt-2">Building summary ...</p>
          )}
          {isViewerZipReady && viewerJobId && (
            <a
              href={`/api/viewer-downloads?jobId=${viewerJobId}`}
              className="btn btn-accent"
              download
            >
              Download Shareable Summary
            </a>
          )}
        </div>
      </CollapseCard>

      <CollapseCard title="Download STAPLE Schemas" className="mb-4">
        <p>
          Projects that use official STAPLE schemas will show those schemas here for download. This
          is helpful for reuse, documentation, or validation in other systems.
        </p>
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
