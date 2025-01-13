import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import getProjectData from "src/summary/queries/getProjectData"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import DateFormat from "src/core/components/DateFormat"
import DownloadJSON from "src/forms/components/DownloadJSON"
import { MetadataDisplay } from "src/summary/components/MetaDataDisplay"

const Summary = () => {
  // Get data
  // Get projects
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProjectData, { id: projectId })

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">Project Summary</h1>

      {/* Project  information */}
      <div className="flex flex-row justify-center m-2">
        <div className="card bg-base-300 mx-2 w-full">
          <div className="card-body">
            <div className="card-title">Project Metadata</div>
            <br />
            Name: {project.name}
            <br />
            Created: <DateFormat date={project.createdAt}></DateFormat>
            <br />
            Last Update: <DateFormat date={project.updatedAt}></DateFormat>
            <br />
            Description: {project.description}
            {project.metadata ? (
              <MetadataDisplay metadata={project.metadata} />
            ) : (
              <div>No metadata available for this project.</div>
            )}
            <div className="card-actions justify-end">
              <Link
                className="btn btn-primary"
                href={Routes.EditProjectPage({ projectId: projectId! })}
              >
                Edit
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex flex-row justify-center m-2">
        <div className="card bg-base-300 mx-2 w-full">
          <div className="card-body">
            <div className="card-title">Summary Stats</div>
            <div className="w-full flex flex-row justify-center">
              <DownloadJSON
                data={project}
                fileName={`${project.name}`}
                className="btn btn-primary"
              />

              <button className="btn btn-secondary mx-2">Launch Viewer (coming soon)</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

const SummaryPage = () => {
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])

  return (
    <Layout title="Project Summary">
      <Suspense fallback={<div>Loading...</div>}>
        <Summary />
      </Suspense>
    </Layout>
  )
}

export default SummaryPage
