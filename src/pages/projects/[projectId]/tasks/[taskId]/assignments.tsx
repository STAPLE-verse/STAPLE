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
import Table from "src/core/components/Table"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"
import Link from "next/link"

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
    where: { taskId: taskId },
    include: {
      task: true,
      team: true,
      contributor: {
        include: {
          user: true,
        },
      },
    },
    // TODO: replace this with actual type def
  }) as unknown as [AssignmentWithRelations[], { refetch: () => void }]

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
      <Suspense fallback={<div>Loading...</div>}>
        <main className="flex flex-col mb-2 currentContributormt-2 mx-auto w-full max-w-7xl">
          <h1>Assignments</h1>
          <Table columns={assignmentTableColumns} data={assignments} />
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
