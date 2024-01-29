import { Suspense, useEffect, useState } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import getTeam from "src/teams/queries/getTeam"
import deleteTeam from "src/teams/mutations/deleteTeam"
import JsonForm from "src/assignments/components/JsonForm"

import getJsonSchema from "src/services/jsonconverter/getJsonSchema"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"
import getProject from "src/projects/queries/getProject"
import Modal from "src/core/components/Modal"
import getAssignments from "src/assignments/queries/getAssignments"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import updateAssignment from "src/assignments/mutations/updateAssignment"
import getContributor from "src/contributors/queries/getContributor"
import { AssignmentStatus } from "@prisma/client"
import {
  AssignmentWithRelations,
  assignmentTableColumns,
} from "src/assignments/components/AssignmentTable"
import Table from "src/core/components/Table"
import CompleteToggle from "src/assignments/components/CompleteToggle"
import getContributors from "src/contributors/queries/getContributors"
import { getInitials } from "src/services/getInitials"

// import { AssignmentTable } from "src/assignments/components/AssignmentTable"

export const ShowTeamPage = () => {
  // Setup
  const router = useRouter()
  const [deleteTeamMutation] = useMutation(deleteTeam)
  // const [updateAssignmentMutation] = useMutation(updateAssignment)
  // // Get values
  const currentUser = useCurrentUser()
  const teamId = useParam("teamId", "number")
  const [team] = useQuery(getTeam, { id: teamId }) //include: { contributors: true }

  const [{ contributors }] = useQuery(getContributors, {
    where: { teams: { some: { id: teamId } } },
    orderBy: { id: "asc" },
    include: {
      user: true,
    },
  })
  console.log(contributors)

  const projectId = useParam("projectId", "number")
  // TODO: we only need this to send the project name to sidebar see if there is an option to get around this by making the sidebar component more abstract
  const [project] = useQuery(getProject, { id: projectId })
  // Get sidebar options
  const sidebarItems = ProjectSidebarItems(projectId!, null)
  // Note: we have to get this separately because the currentContributor does not neccesarily have an assignment
  // const currentContributor = useQuery(getContributor, {
  //   where: { projectId: projectId, userId: currentUser!.id },
  // })

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
      <Suspense fallback={<div>Loading...</div>}>
        <Head>
          <title>Team {team.name}</title>
        </Head>

        <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
          <div className="flex mt-4">
            <h1>Team: {team.name}</h1>
          </div>
          <div className="flex mt-4 text-2xl">Members</div>

          {/* TODO refactor this to a global compoenent to show contributors , also used in contributor page */}
          <div className="flex mt-4">
            {contributors.map((contributor) => {
              const firstName = contributor["user"].firstName
              const lastName = contributor["user"].lastName
              const username = contributor["user"].username
              const initial = getInitials(firstName, lastName)

              return (
                <div className="card bg-base-200 mb-2" key={contributor.id}>
                  <div className="card-body flex flex-row justify-between">
                    <div className="flex items-center">
                      <div className="avatar placeholder">
                        <div className="w-12 rounded-full bg-neutral-focus text-neutral-content">
                          <span className="text-1xl">{initial ? initial : "?"}</span>
                        </div>
                      </div>
                      <div className="text-2xl ml-4">
                        <p>{firstName || lastName ? `${firstName} ${lastName}` : username}</p>
                      </div>
                    </div>
                    <div className="justify-end">
                      <Link
                        className="btn"
                        href={Routes.ShowContributorPage({
                          projectId: projectId!,
                          contributorId: contributor.id,
                        })}
                      >
                        See contributions
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="btn"
              onClick={async () => {
                if (
                  window.confirm("The team will be permanently deleted. Are you sure to continue?")
                ) {
                  await deleteTeamMutation({ id: team.id })
                  await router.push(Routes.TasksPage({ projectId: projectId! }))
                }
              }}
            >
              Delete team
            </button>
          </div>
          {/* <Suspense fallback={<div>Loading...</div>}>
            <div className="divider">
              <h2>Assignments</h2>
            </div>
            <Table columns={assignmentTableColumns} data={assignments} />
          </Suspense> */}
        </main>
      </Suspense>
    </Layout>
  )
}

ShowTeamPage.authenticate = true

export default ShowTeamPage
