import { Suspense, useState } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useQuery } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import Layout from "src/core/layouts/Layout"
import getProject from "src/projects/queries/getProject"
import ByProjectMembers from "src/summary/components/ByProjectMembers"
import ByTasks from "src/summary/components/ByTasks"
import ByRoles from "src/summary/components/ByRoles"
import ByDate from "src/summary/components/ByDate"
import ByElements from "src/summary/components/ByElements"
import getTasks from "src/tasks/queries/getTasks"
import getRoles from "src/roles/queries/getRoles"
import getElements from "src/elements/queries/getElements"
import getTeams from "src/teams/queries/getTeams"
import getProjectMembers from "src/projectmembers/queries/getProjectMembers"
import useProjectMemberAuthorization from "src/projectmembers/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
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
      roles: true,
      element: true,
      createdBy: {
        include: { users: true },
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
              projectMembers: {
                include: { users: true },
              },
            },
          },
          projectMember: {
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
      projectMembers: {
        include: { user: true },
      },
    },
  })
  // Get projectMembers
  //TODO: Only needs tos include role id
  const [{ projectMembers }] = useQuery(getProjectMembers, {
    where: { project: { id: projectId! } },
    orderBy: { user: { lastName: "asc" } },
    include: {
      user: true,
      roles: true,
      assignmentStatusLog: true,
    },
  })

  // get all roles from all PMs
  const projectManagers = projectMembers.filter(
    (projectMember) => projectMember.privilege === "PROJECT_MANAGER"
  )
  const pmIds = projectManagers.map((pm) => pm.userId)
  const [{ roles }] = useQuery(getRoles, {
    where: {
      userId: {
        in: pmIds, // Filter roles where userId is in the list of PM IDs
      },
    },
    include: {
      projectMembers: true, // Optional: include projectMember data if needed
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
        {/* A dropdown menu here for organization: By Date, By Task, By Contributor, By Role, By
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
          <option value="projectMember">Organize project by Contributor </option>
          <option value="role">Organize project by Role</option>
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
            {selectedOrganization === "projectMember" && (
              <ByProjectMembers
                tasks={tasks}
                teams={teams}
                projectMembers={projectMembers}
              ></ByProjectMembers>
            )}
            {selectedOrganization === "task" && (
              <ByTasks tasks={tasks} projectMembers={projectMembers} teams={teams}></ByTasks>
            )}
            {selectedOrganization === "role" && (
              <ByRoles roles={roles} tasks={tasks} projectMembers={projectMembers}></ByRoles>
            )}
            {selectedOrganization === "date" && (
              <ByDate tasks={tasks} projectMembers={projectMembers} teams={teams}></ByDate>
            )}
            {selectedOrganization === "element" && (
              <ByElements
                elements={elements}
                teams={teams}
                projectMembers={projectMembers}
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
  useProjectMemberAuthorization([MemberPrivileges.PROJECT_MANAGER])

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
