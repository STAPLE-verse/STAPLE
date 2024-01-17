import { Suspense, useEffect, useState } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "src/core/layouts/Layout"
import getTask from "src/tasks/queries/getTask"
import deleteTask from "src/tasks/mutations/deleteTask"
import JsonForm from "src/assignments/components/JsonForm"

import getJsonSchema from "src/services/jsonconverter/getJsonSchema"
import { ProjectSidebarItems } from "src/core/layouts/SidebarItems"
import getProject from "src/projects/queries/getProject"
import Modal from "src/core/components/Modal"
import getAssignments from "src/assignments/queries/getAssignments"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getAssignedUsers from "src/assignments/queries/getAssignedUsers"
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

export const ShowTaskPage = () => {
  // Setup
  const router = useRouter()
  const [deleteTaskMutation] = useMutation(deleteTask)
  const [updateAssignmentMutation] = useMutation(updateAssignment)
  // Get values
  const currentUser = useCurrentUser()
  const taskId = useParam("taskId", "number")
  const [task] = useQuery(getTask, { id: taskId, include: { element: true, column: true } })
  const projectId = useParam("projectId", "number")
  // TODO: we only need this to send the project name to sidebar see if there is an option to get around this by making the sidebar component more abstract
  const [project] = useQuery(getProject, { id: projectId })
  // Get sidebar options
  const sidebarItems = ProjectSidebarItems(projectId!, null)
  // Note: we have to get this separately because the currentContributor does not neccesarily have an assignment
  const currentContributor = useQuery(getContributor, {
    where: { projectId: projectId, userId: currentUser!.id },
  })
  // Get assignments
  const [assignments, { refetch }] = useQuery(getAssignments, {
    where: { taskId: taskId },
    include: {
      task: true,
      contributor: {
        include: {
          user: true,
        },
      },
    },
    // TODO: replace this with actual type def
  }) as unknown as [AssignmentWithRelations[], { refetch: () => void }]
  // TODO: Chris, do I need this?
  // Get values dependent on assignments
  // const [currentAssignment, setCurrentAssignment] = useState<AssignmentWithRelations>()
  // useEffect(() => {
  //   // Get currentAssignment
  //   const currentAssignment = assignments.find(
  //     (assignment) => assignment.contributorId === currentContributor[0].id
  //   )
  //   // TODO: If currentContributor is not assigned currentAssignment is undefined
  //   setCurrentAssignment(currentAssignment)
  // }, [assignments])

  const currentAssignment = assignments.find(
    (assignment) => assignment.contributorId === currentContributor[0].id
  )

  // Handle metadata input
  const [openAssignmentModal, setOpenAssignmentModal] = useState(false)
  const handleToggle = () => {
    setOpenAssignmentModal((prev) => !prev)
  }

  const handleJsonFormSubmit = async (data) => {
    if (currentAssignment) {
      // Users can overwrite their responses
      await updateAssignmentMutation({
        id: currentAssignment.id,
        metadata: data.formData,
        status: AssignmentStatus.COMPLETED,
      })
      await handleToggle()
      await refetch()
    } else {
      console.error("currentAssignment is undefined")
    }
  }

  const handleJsonFormError = (errors) => {
    console.log(errors)
  }

  return (
    <Layout sidebarItems={sidebarItems} sidebarTitle={project.name}>
      <Suspense fallback={<div>Loading...</div>}>
        <Head>
          <title>Task {task.name}</title>
        </Head>

        <main className="flex flex-col mb-2 mt-2 mx-auto w-full max-w-7xl">
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
        </main>
      </Suspense>
    </Layout>
  )
}

ShowTaskPage.authenticate = true

export default ShowTaskPage
