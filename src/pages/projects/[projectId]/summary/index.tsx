import { Suspense, useState } from "react"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import getProject from "src/projects/queries/getProject"
import getRoles from "src/roles/queries/getRoles"
import getElements from "src/elements/queries/getElements"
import getProjectMembers from "src/projectmembers/queries/getProjectMembers"
import useProjectMemberAuthorization from "src/projectprivileges/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import DateFormat from "src/core/components/DateFormat"
import getTaskLogs from "src/tasklogs/queries/getTaskLogs"
import getProjectManagers from "src/projectmembers/queries/getProjectManagers"
import DownloadJSON from "src/forms/components/DownloadJSON"

const Summary = () => {
  // Get data
  // Get projects
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">Project Summary</h1>

      {/* Project  information */}
      <div className="flex flex-row justify-center m-2">
        <div className="card bg-base-300 mx-2 w-full">
          <div className="card-body">
            <div className="card-title">Project Metadata</div>
            {/* <br /> WORD IN CAPS IS THE DATABASE COLUMN */}
            <br />
            Name: {project.name}
            <br />
            Created: <DateFormat date={project.createdAt}></DateFormat>
            <br />
            Update: <DateFormat date={project.updatedAt}></DateFormat>
            <br />
            Description: {project.description}
            <br />
            Abstract: {project.abstract}
            <br />
            Keywords: {project.keywords}
            <br />
            Citation: {project.citation}
            <br />
            Publisher: {project.publisher}
            <br />
            Identifier: {project.identifier}
            <div className="card-actions justify-end">
              <DownloadJSON
                data={project}
                fileName={`${project.name}`}
                className="btn btn-primary"
              />

              <Link
                className="btn btn-secondary"
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
            <div className="card-title">Organized Metadata (under construction)</div>
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
