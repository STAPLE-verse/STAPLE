import { Suspense } from "react"
import { useQuery } from "@blitzjs/rpc"
import { Routes, useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import getAssignments from "src/assignments/queries/getAssignments"
import {
  AssignmentWithRelations,
  assignmentTableColumns,
  assignmentTableColumnsSchema,
} from "src/assignments/components/AssignmentTable"

import {
  TeamAssignmentWithRelations,
  teamAssignmentTableColumns,
  teamAssignmentTableColumnsSchema,
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

  console.log(assignments[0].task.schema)

  let individualColumns
  let teamColumns
  if (assignments[0].task.schema) {
    individualColumns = assignmentTableColumnsSchema
    teamColumns = teamAssignmentTableColumnsSchema
  } else {
    individualColumns = assignmentTableColumns
    teamColumns = teamAssignmentTableColumns
  }

  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <main className="flex flex-col mb-2 currentContributormt-2 mx-auto w-full max-w-7xl">
          <h1 className="flex justify-center mb-2 text-3xl">Review and Complete Tasks</h1>

          <div className="flex flex-row justify-center">
            <div className="card bg-base-300 w-full">
              <div className="card-body overflow-x-auto">
                <div className="card-title">TASK NAME</div>
                TASK INFORMATION BUTTONS
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-center mt-2">
            <div className="card bg-base-300 w-full">
              <div className="card-body overflow-x-auto">
                <div className="card-title">Individual Contributors</div>
                {assignments.length > 0 ? (
                  <Table columns={individualColumns} data={assignments} />
                ) : (
                  <span>This task does not have individual contributors </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-center mt-2">
            <div className="card bg-base-300 w-full">
              <div className="card-body overflow-x-auto">
                <div className="card-title">Team Contributors</div>
                {teamAssignments.length > 0 ? (
                  <Table columns={teamColumns} data={teamAssignments} />
                ) : (
                  <span>This task does not have teams of contributors</span>
                )}
              </div>
            </div>
          </div>

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
