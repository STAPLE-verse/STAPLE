import { Suspense, useState } from "react"
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
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import updateAssignment from "src/assignments/mutations/updateAssignment"
import getContributor from "src/contributors/queries/getContributor"
import { AssignmentStatus, ContributorRole } from "@prisma/client"
import CompleteToggle from "src/assignments/components/CompleteToggle"
import getAssignment from "src/assignments/queries/getAssignment"

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
  const [currentContributor] = useQuery(getContributor, {
    where: { projectId: projectId, userId: currentUser!.id },
  })
  const [currentAssignment, { refetch }] = useQuery(getAssignment, {
    where: { taskId: taskId, contributorId: currentContributor.id },
  })

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

        <main className="flex flex-col mb-2 currentContributormt-2 mx-auto w-full max-w-7xl">
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
                    Save
                  </button>
                </div>
              </Modal>
            </div>
          )}

          {!task["schema"] && currentAssignment && (
            <CompleteToggle currentAssignment={currentAssignment} refetch={refetch} />
          )}

          {currentContributor.role == ContributorRole.PROJECT_MANAGER && (
            <div className="flex justify-start mt-4">
              <Link
                className="btn"
                href={Routes.AssignmentsPage({ projectId: projectId!, taskId: task.id })}
              >
                Assignments
              </Link>
            </div>
          )}

          <div className="flex flex-row justify-end mt-4 space-x-4">
            <Link
              className="btn"
              href={Routes.EditTaskPage({ projectId: projectId!, taskId: task.id })}
            >
              Update task
            </Link>
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
        </main>
      </Suspense>
    </Layout>
  )
}

ShowTaskPage.authenticate = true

export default ShowTaskPage
