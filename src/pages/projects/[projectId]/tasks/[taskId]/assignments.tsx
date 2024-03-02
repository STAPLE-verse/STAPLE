import { Suspense } from "react"
import { useQuery } from "@blitzjs/rpc"
import { Routes, useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import getProject from "src/projects/queries/getProject"
import getAssignments from "src/assignments/queries/getAssignments"
import {
  AssignmentWithRelations,
  assignmentTableColumns,
} from "src/assignments/components/AssignmentTable"

import {
  TeamAssignmentWithRelations,
  teamAssignmentTableColumns,
} from "src/assignments/components/TeamAssignmentTable"

import Table from "src/core/components/Table"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"
import Link from "next/link"

function getContributorTable(assignments) {
  if (assignments.length > 0) {
    return (
      <div>
        <h2>Individual Contributors </h2>
        <Table columns={assignmentTableColumns} data={assignments} />
      </div>
    )
  } else {
    return <h4>This task does not have individual contributors </h4>
  }
}

function getTeamsContributorTable(assignments) {
  if (assignments.length > 0) {
    return (
      <div>
        <h2>Contributors Teams</h2>
        <Table columns={teamAssignmentTableColumns} data={assignments} />
      </div>
    )
  } else {
    return <h4>This task does not have team of contributors </h4>
  }
}

export const AssignmentsPage = () => {
  // Get values
  const taskId = useParam("taskId", "number")
  const projectId = useParam("projectId", "number")
  // TODO: we only need this to send the project name to sidebar see if there is an option to get around this by making the sidebar component more abstract
  const [project] = useQuery(getProject, { id: projectId })
  // Get sidebar options
  const sidebarItems = ProjectSidebarItems(projectId!, null)
  // Get assignments
  const [assignments] = useQuery(getAssignments, {
    where: { taskId: taskId, teamId: null, contributorId: { not: null } },
    include: {
      task: true,
      contributor: {
        include: {
          user: true,
        },
      },
    },
  }) as unknown as [AssignmentWithRelations[], { refetch: () => void }]

  const [teamAssignments] = useQuery(getAssignments, {
    where: { taskId: taskId, contributorId: null, teamId: { not: null } },
    include: {
      task: true,
      team: {
        include: {
          contributors: {
            include: {
              user: true,
            },
          },
        },
      },
    },
    // TODO: replace this with actual type def
  }) as unknown as [TeamAssignmentWithRelations[], { refetch: () => void }]

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
      <Suspense fallback={<div>Loading...</div>}>
        <main className="flex flex-col mb-2 currentContributormt-2 mx-auto w-full max-w-7xl">
          <h1>Assignments</h1>
          <br></br>
          {getContributorTable(assignments)}
          <br></br>
          {getTeamsContributorTable(teamAssignments)}
          <Link
            className="btn self-end mt-4"
            href={Routes.ShowTaskPage({ projectId: projectId!, taskId: taskId! })}
          >
            Go back
          </Link>
        </main>
      </Suspense>
    </Layout>
  )
}

AssignmentsPage.authenticate = true

export default AssignmentsPage
