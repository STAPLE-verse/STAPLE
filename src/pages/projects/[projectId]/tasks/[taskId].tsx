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
import getAssignment from "src/assignments/queries/getAssignment"
// import { AssignmentTable } from "src/assignments/components/AssignmentTable"

export const ShowTaskPage = () => {
  // Setup
  const currentUser = useCurrentUser()
  const router = useRouter()
  const [deleteTaskMutation] = useMutation(deleteTask)
  const [updateAssignmentMutation] = useMutation(updateAssignment)
  const taskId = useParam("taskId", "number")
  const projectId = useParam("projectId", "number")
  const currentContributor = useQuery(getContributor, {
    where: { projectId: projectId, userId: currentUser!.id },
  })
  const [project] = useQuery(getProject, { id: projectId })
  const [task] = useQuery(getTask, { id: taskId, include: { element: true, column: true } })
  const [assignments] = useQuery(getAssignments, {
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
  }) as unknown as [AssignmentWithRelations[]]

  const [currentAssigment, { refetch }] = useQuery(getAssignment, {
    where: { taskId: taskId, contributorId: currentContributor[0].id },
  })

  const [userIds] = useQuery(getAssignedUsers, { taskId: taskId! })

  // Get sidebar options
  const sidebarItems = ProjectSidebarItems(projectId!, null)

  // Handle metadata input
  const [openAssignmentModal, setOpenAssignmentModal] = useState(false)
  const handleToggle = () => {
    setOpenAssignmentModal((prev) => !prev)
  }

  const handleJsonFormSubmit = async (data) => {
    // Users can overwrite their responses
    await updateAssignmentMutation({
      id: currentAssigment[0].id,
      metadata: data.formData,
      status: AssignmentStatus.COMPLETED,
    })
    await handleToggle()
  }

  const handleJsonFormError = (errors) => {
    console.log(errors)
  }
  // Handle assignment status
  const handleAssignmentStatusToggle = async () => {
    const newStatus =
      currentAssigment.status === AssignmentStatus.COMPLETED
        ? AssignmentStatus.NOT_COMPLETED
        : AssignmentStatus.COMPLETED

    await updateAssignmentMutation({
      id: currentAssigment.id,
      status: newStatus,
    })

    await refetch()
  }

  const [isChecked, setIsChecked] = useState(currentAssigment.status === AssignmentStatus.COMPLETED)

  useEffect(() => {
    // Update the local state when the assignment status changes in the database
    setIsChecked(currentAssigment.status === AssignmentStatus.COMPLETED || false)
  }, [currentAssigment])

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

          {task["schema"] && userIds.includes(currentUser!.id) && (
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

          {!task["schema"] && userIds.includes(currentUser!.id) && (
            <div className="flex items-center space-x-2">
              <span>Not Completed</span>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="toggle"
                  checked={isChecked}
                  onChange={handleAssignmentStatusToggle}
                />
                <span className="ml-2">Completed</span>
              </label>
            </div>
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
