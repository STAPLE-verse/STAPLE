import { Suspense, useState } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import getProject from "src/projects/queries/getProject"
import ByContributors from "src/summary/components/ByContributors"
import ByTasks from "src/summary/components/ByTasks"
import ByLabels from "src/summary/components/ByLabels"
import ByDate from "src/summary/components/ByDate"
import ByElements from "src/summary/components/ByElements"
import getTasks from "src/tasks/queries/getTasks"
import getLabels from "src/labels/queries/getLabels"
import getElements from "src/elements/queries/getElements"
import getTeams from "src/teams/queries/getTeams"
import getContributors from "src/contributors/queries/getContributors"
import useContributorAuthorization from "src/contributors/hooks/UseContributorAuthorization"
import { ContributorPrivileges } from "db"
import DateFormat from "src/core/components/DateFormat"

const Summary = () => {
  // Setup
  const [selectedOrganization, setSelectedOrganization] = useState("none")

  // Get data
  // Get projects
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })
  // Get tasks
  const [{ tasks }] = useQuery(getTasks, {
    where: { projectId: projectId },
    orderBy: { createdAt: "desc" },
    include: {
      labels: true,
      element: true,
      createdBy: {
        include: { user: true },
      },
      assignees: {
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          statusLogs: {
            orderBy: {
              createdAt: "desc",
            },
          },
          team: {
            include: {
              contributors: {
                include: { user: true },
              },
            },
          },
          contributor: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  })
  // Get elements
  const [{ elements }] = useQuery(getElements, {
    where: { project: { id: projectId! } },
    orderBy: { id: "asc" },
    // include: { task: true },
  })
  // Get teams
  const [{ teams }] = useQuery(getTeams, {
    where: { project: { id: projectId! } },
    orderBy: { name: "asc" },
    include: {
      assignments: {
        include: {
          statusLogs: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
      contributors: {
        include: { user: true },
      },
    },
  })
  // Get contributors
  //TODO: Only needs tos include label id
  const [{ contributors }] = useQuery(getContributors, {
    where: { project: { id: projectId! } },
    orderBy: { user: { lastName: "asc" } },
    include: {
      user: true,
      labels: true,
      assignmentStatusLog: true,
    },
  })

  // get all labels from all PMs
  const projectManagers = contributors.filter(
    (contributor) => contributor.privilege === "PROJECT_MANAGER"
  )
  const pmIds = projectManagers.map((pm) => pm.userId)
  const [{ labels }] = useQuery(getLabels, {
    where: {
      userId: {
        in: pmIds, // Filter labels where userId is in the list of PM IDs
      },
    },
    include: {
      contributors: true, // Optional: include contributor data if needed
    },
  })

  // Handle events
  const handleOrganizationChanged = (e) => {
    //do query based on organization
    setSelectedOrganization(e)
  }

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">Project Summary</h1>

      {/* Select organization */}
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
          <option value="contributor">Organize project by Contributor </option>
          <option value="label">Organize project by Role</option>
          <option value="element">Organize project by Element</option>
        </select>
      </div>

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
            <div className="card-title">Organized Metadata (under construction)</div>
            {selectedOrganization === "contributor" && (
              <ByContributors
                tasks={tasks}
                teams={teams}
                contributors={contributors}
              ></ByContributors>
            )}
            {selectedOrganization === "task" && (
              <ByTasks tasks={tasks} contributors={contributors} teams={teams}></ByTasks>
            )}
            {selectedOrganization === "label" && (
              <ByLabels labels={labels} tasks={tasks} contributors={contributors}></ByLabels>
            )}
            {selectedOrganization === "date" && (
              <ByDate tasks={tasks} contributors={contributors} teams={teams}></ByDate>
            )}
            {selectedOrganization === "element" && (
              <ByElements
                elements={elements}
                teams={teams}
                contributors={contributors}
                tasks={tasks}
              ></ByElements>
            )}
            {selectedOrganization === "none" && <span>Please select an output organization.</span>}
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
  )
}

const SummaryPage = () => {
  useContributorAuthorization([ContributorPrivileges.PROJECT_MANAGER])

  return (
    <Layout>
      <Head>
        <title>Project Summary</title>
      </Head>
      <Suspense fallback={<div>Loading...</div>}>
        <Summary />
      </Suspense>
    </Layout>
  )
}

export default SummaryPage
