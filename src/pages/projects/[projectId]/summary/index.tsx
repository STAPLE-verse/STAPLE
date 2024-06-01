import { Suspense, useState } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { usePaginatedQuery, useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"

import Layout from "src/core/layouts/Layout"
import getProject from "src/projects/queries/getProject"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"
import { PlusIcon } from "@heroicons/react/24/outline"
import ByContributors from "./ByContributors"
import ByTasks from "./ByTasks"
import ByLabels from "./ByLabels"
import ByDate from "./ByDate"
import ByElements from "./ByElements"

//could refactor other places and move this to utils
const formatDate = (myDate) =>
  myDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Use 24-hour format
  })

const SummaryPage = () => {
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })
  const sidebarItems = ProjectSidebarItems(projectId!, "Summary")
  const [selectedOrganization, setSelectedOrganization] = useState("none")

  const handleOrganizationChanged = (e) => {
    //do query based on organization
    // console.log(e)
    setSelectedOrganization(e)
  }

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
      <Suspense fallback={<div>Loading...</div>}>
        <Head>
          <title>Project Summary</title>
        </Head>

        <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
          <h1 className="flex justify-center mb-2 text-3xl">Project Summary</h1>

          <div className="flex flex-row justify-center m-2">
            {/* A dropdown menu here for organization: By Date, By Task, By Contributor, By Label, By
            Element */}
            <select
              className="select select-info w-full max-w-xs"
              onChange={(e) => handleOrganizationChanged(e.target.value)}
            >
              <option disabled selected value="none">
                Organize project by:
              </option>
              <option value="date">Organize project by Date</option>
              <option value="task">Organize project by Task</option>
              <option value="contributor">Organize project by Contributor (Assigment)</option>
              <option value="label">Organize project by Label</option>
              <option value="element">Organize project by Element</option>
            </select>
          </div>

          <div className="flex flex-row justify-center m-2">
            <div className="card bg-base-300 mx-2 w-full">
              <div className="card-body">
                <div className="card-title">Project Metadata</div>
                {/* <br /> WORD IN CAPS IS THE DATABASE COLUMN */}
                <br />
                Name: {project.name}
                <br />
                Created: {formatDate(project.createdAt)}
                <br />
                Update: {formatDate(project.updatedAt)}
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

          <div className="flex flex-row justify-center m-2">
            <div className="card bg-base-300 mx-2 w-full">
              <div className="card-body">
                <div className="card-title">Organized Metadata</div>
                {selectedOrganization === "contributor" && (
                  <ByContributors projectId={projectId}></ByContributors>
                )}
                {selectedOrganization === "task" && <ByTasks></ByTasks>}
                {selectedOrganization === "label" && <ByLabels></ByLabels>}
                {selectedOrganization === "date" && <ByDate></ByDate>}
                {selectedOrganization === "element" && <ByElements></ByElements>}
                {selectedOrganization === "none" && (
                  <span>Needs to select an organization or should we have a default?</span>
                )}
                {/* <br />
                Here we will print out the database basically by organization they pick at the top
                <br />
                So, if they pick by date: Print out the date, everything that happened on that date
                with breaks between the dates
                <br />
                If they pick by task, loop through the tasks and print out each thing, etc. */}
              </div>
            </div>
          </div>
        </main>
      </Suspense>
    </Layout>
  )
}

export default SummaryPage
