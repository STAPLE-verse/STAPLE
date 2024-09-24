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
import getRoles from "src/roles/queries/getRoles"
import getElements from "src/elements/queries/getElements"
import getProjectMembers from "src/projectmembers/queries/getProjectMembers"
import useProjectMemberAuthorization from "src/projectmembers/hooks/UseProjectMemberAuthorization"
import { MemberPrivileges } from "db"
import DateFormat from "src/core/components/DateFormat"
import getTaskLogs from "src/tasklogs/queries/getTaskLogs"
import getProjectManagers from "src/projectmembers/queries/getProjectManagers"

const Summary = () => {
  // Setup
  const [selectedOrganization, setSelectedOrganization] = useState("none")

  // Get data
  // Get projects
  const projectId = useParam("projectId", "number")
  const [project] = useQuery(getProject, { id: projectId })

  // Get taskLogs and tasks
  const [taskLogs] = useQuery(getTaskLogs, {
    where: {
      task: {
        projectId: projectId,
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      task: {
        include: {
          roles: true, // Include the roles relation within the task relation
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

  // Get only contributors one person no team
  const [{ projectMembers }] = useQuery(getProjectMembers, {
    where: {
      projectId: projectId,
      users: {
        every: {
          id: { not: undefined }, // Ensures there's at least one user
        },
        none: {
          id: { gt: 1 }, // Ensures there is only one user
        },
      },
      name: { equals: null }, // Ensures the name in ProjectMember is null
    },
    include: {
      users: true,
      roles: true,
    },
  })

  // Map through projectMembers and flatten the users array to extract firstName and lastName
  const flattenedMembers = projectMembers.map((member) => {
    // Assuming there's only one user in each projectMember's `users` array
    const user = member["users"][0] // Safe because you ensured only one user
    return {
      projectMemberId: member.id,
      firstName: user?.firstName ?? "", // Ensure user exists and has firstName
      lastName: user?.lastName ?? "",
      role: member["roles"].map((role) => role.name).join(", "), // Flatten roles if needed
    }
  })

  // get teams with a name because they can be one person teams
  const [teams] = useQuery(getProjectMembers, {
    where: {
      projectId: projectId,
      name: { not: null }, // Ensures the name in ProjectMember is non-null
      users: {
        some: { id: { not: undefined } }, // Ensures there's at least one user
      },
    },
    include: {
      users: true,
      roles: true,
    },
  })

  const projectManagers = useQuery(getProjectManagers, {
    where: {
      projectId: projectId,
      privilege: "PROJECT_MANAGER",
    },
  })

  const roles = useQuery(getRoles, {
    where: {
      userId: { in: projectManagers.map((pm) => pm.userId) }, // Ensure userId is an array
    },
  })

  // Handle events
  const handleOrganizationChanged = (e) => {
    //do query based on organization
    setSelectedOrganization(e)
  }

  //console.log(teams)

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
                tasks={taskLogs}
                teams={teams}
                projectMembers={flattenedMembers}
              ></ByProjectMembers>
            )}
            {selectedOrganization === "task" && (
              <ByTasks tasks={taskLogs} projectMembers={flattenedMembers} teams={teams}></ByTasks>
            )}
            {selectedOrganization === "role" && (
              <ByRoles roles={roles} tasks={taskLogs} projectMembers={flattenedMembers}></ByRoles>
            )}
            {selectedOrganization === "date" && (
              <ByDate tasks={taskLogs} projectMembers={flattenedMembers} teams={teams}></ByDate>
            )}
            {selectedOrganization === "element" && (
              <ByElements
                elements={elements}
                teams={teams}
                projectMembers={flattenedMembers}
                tasks={taskLogs}
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
