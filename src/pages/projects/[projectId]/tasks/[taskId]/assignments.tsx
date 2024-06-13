import { Suspense } from "react"
import { useQuery } from "@blitzjs/rpc"
import { Routes, useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
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
import Link from "next/link"

export const AssignmentsPage = () => {
  // Get values
  const taskId = useParam("taskId", "number")
  const projectId = useParam("projectId", "number")

  // Get assignments
  const [assignments] = useQuery(getAssignments, {
    where: { taskId: taskId, teamId: null },
    include: {
      task: true,
      contributor: {
        include: {
          user: true,
        },
      },
      statusLogs: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1, // TODO: Make new queries that are specified to these tasks once MVP is nearly ready
      },
    },
    // TODO: replace this with actual type def
  }) as unknown as [AssignmentWithRelations[], { refetch: () => void }]

  const [teamAssignments] = useQuery(getAssignments, {
    where: { taskId: taskId, contributorId: null },
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
      statusLogs: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1, // TODO: Make new queries that are specified to these tasks once MVP is nearly ready
      },
    },
    // TODO: replace this with actual type def
  }) as unknown as [TeamAssignmentWithRelations[], { refetch: () => void }]

  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <main className="flex flex-col mb-2 currentContributormt-2 mx-auto w-full max-w-7xl">
          <h1>Assignments</h1>
          <br></br>
          <h2>Individual Contributors</h2>
          {assignments.length > 0 ? (
            <Table columns={assignmentTableColumns} data={assignments} />
          ) : (
            <h4>This task does not have individual contributors </h4>
          )}
          <br></br>
          <h2>Contributor Teams</h2>
          {teamAssignments.length > 0 ? (
            <Table columns={teamAssignmentTableColumns} data={teamAssignments} />
          ) : (
            <h4>This task does not have teams of contributors </h4>
          )}

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
