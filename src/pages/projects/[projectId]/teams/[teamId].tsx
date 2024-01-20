import { Suspense, useEffect, useState } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import getTeam from "src/teams/queries/getTeam"
import deleteTask from "src/tasks/mutations/deleteTask"
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

// import { AssignmentTable } from "src/assignments/components/AssignmentTable"

export const ShowTeamPage = () => {
  // Setup
  const router = useRouter()
  // const [deleteTaskMutation] = useMutation(deleteTask)
  // const [updateAssignmentMutation] = useMutation(updateAssignment)
  // // Get values
  const currentUser = useCurrentUser()
  const teamId = useParam("teamId", "number")
  const [team] = useQuery(getTeam, { id: teamId }) //include: { element: true, column: true }
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
          {/* <title>Task {task.name}</title> */}
          <title>show created team</title>
        </Head>
        <div> teat </div>

        {/* <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
          <h1>{task.name}</h1>
          <div className="flex flex-col gap-2">
            <p>{task.description}</p>
            <p>
              <span className="font-semibold">Status:</span> {task["column"].name}
            </p>
            <p>
              <span className="font-semibold">Element:</span>{" "}
              {task["element"] ? task["element"].name : "no elements"}
            </p>
            <p className="italic">Last update: {task.updatedAt.toString()}</p>
            <p>
              <span className="font-semibold">Current metadata schema:</span>{" "}
              {task["schema"] ? JSON.stringify(task["schema"]) : "no metadata schema assigned"}
            </p>
          </div>

          {task["schema"] && currentAssignment && (
            <div className="mt-4">
              <button className="btn" onClick={() => handleToggle()}>
                Provide metadata
              </button>
              <Modal open={openAssignmentModal} size="w-11/12 max-w-5xl">
                <div className="font-sans">
                  {
                    <JsonForm
                      onSubmit={handleJsonFormSubmit}
                      schema={getJsonSchema(task["schema"])}
                      onError={handleJsonFormError}
                    />
                  }
                </div>
                <div className="modal-action">
                  <button className="btn btn-primary" onClick={handleToggle}>
                    Close
                  </button>
                </div>
              </Modal>
            </div>
          )}

          {!task["schema"] && currentAssignment && (
            <CompleteToggle currentAssignment={currentAssignment} refetch={refetch} />
          )}

          <div className="flex justify-start mt-4">
            <Link
              className="btn"
              href={Routes.EditTaskPage({ projectId: projectId!, taskId: task.id })}
            >
              Update task
            </Link>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="btn"
              onClick={async () => {
                if (
                  window.confirm("The task will be permanently deleted. Are you sure to continue?")
                ) {
                  await deleteTaskMutation({ id: task.id })
                  await router.push(Routes.TasksPage({ projectId: projectId! }))
                }
              }}
            >
              Delete task
            </button>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <div className="divider">
              <h2>Assignments</h2>
            </div>
            <Table columns={assignmentTableColumns} data={assignments} />
          </Suspense>
        </main> */}
      </Suspense>
    </Layout>
  )
}

ShowTeamPage.authenticate = true

export default ShowTeamPage
