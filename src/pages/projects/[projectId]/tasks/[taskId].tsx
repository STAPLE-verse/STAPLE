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
import { AssignmentStatus, ContributorPrivileges, TaskStatus, CompletedAs } from "@prisma/client"
import CompleteToggle from "src/assignments/components/CompleteToggle"
import AssignmentProgress from "src/tasks/components/AssignmentProgress"
import updateTaskStatus from "src/tasks/mutations/updateTaskStatus"
import toast from "react-hot-toast"
import getAssignmentProgress from "src/assignments/queries/getAssignmentProgress"
import getAssignments from "src/assignments/queries/getAssignments"

export const ShowTaskPage = () => {
  // Setup
  const router = useRouter()
  const [deleteTaskMutation] = useMutation(deleteTask)
  const [updateAssignmentMutation] = useMutation(updateAssignment)
  const [updateTaskStatusMutation] = useMutation(updateTaskStatus)
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

  // Get assignments
  const [assignmentProgress, { refetch: refetchAssignmentProgress }] = useQuery(
    getAssignmentProgress,
    { taskId: taskId! }
  )

  // Get assignments for the task
  // If someone is assigned as an individual AND as a Team member it is possible to have multiple assignments for the same person for the task
  const [currentAssignments, { refetch: refetchCurrentAssignments }] = useQuery(getAssignments, {
    where: {
      taskId: taskId,
      // Get only assignments for the current contributor
      OR: [
        { contributorId: currentContributor.id }, // Direct assignments to the contributor
        { team: { contributors: { some: { id: currentContributor.id } } } }, // Assignments to teams that include the contributor
      ],
    },
    include: {
      contributor: true,
      team: true,
      statusLogs: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    // Keeping the ordering so that completeToggle button order does not change on refetch
    orderBy: {
      id: "asc",
    },
  })

  // Filter out individual assignments
  const individualAssignments = currentAssignments.filter(
    (assignment) => assignment.contributorId !== null
  )

  // Filter out team assignments
  const teamAssignments = currentAssignments.filter((assignment) => assignment.teamId !== null)

  const refetchAssignments = async () => {
    // await refetchCurrentAssignment()
    await refetchCurrentAssignments()
    await refetchAssignmentProgress()
  }

  // Handle metadata input
  const [openAssignmentModal, setOpenAssignmentModal] = useState(false)
  const handleToggle = () => {
    setOpenAssignmentModal((prev) => !prev)
  }

  const handleJsonFormSubmit = async (data) => {
    if (currentAssignments) {
      // Users can overwrite their responses
      // user can have multiple assignments
      currentAssignments.forEach(async (currentAssignment) => {
        await updateAssignmentMutation({
          id: currentAssignment.id,
          metadata: data.formData,
          status: AssignmentStatus.COMPLETED,
          completedBy: currentContributor.id,
          completedAs: currentAssignment.statusLogs[0].completedAs,
        })
      })

      await handleToggle()
      await refetchAssignments()
    } else {
      console.error("currentAssignment is undefined")
    }
  }

  const handleJsonFormError = (errors) => {
    console.log(errors)
  }

  const [taskStatus, setTaskStatus] = useState(task.status)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

  const handleTaskStatus = async () => {
    if (
      assignmentProgress.completed !== assignmentProgress.all &&
      taskStatus === TaskStatus.NOT_COMPLETED
    ) {
      setIsConfirmModalOpen(true)
    } else {
      await taskStatusUpdate()
    }
  }

  const taskStatusUpdate = async () => {
    const newStatus =
      taskStatus === TaskStatus.COMPLETED ? TaskStatus.NOT_COMPLETED : TaskStatus.COMPLETED

    try {
      const updatedTaskStatus = await updateTaskStatusMutation({ id: taskId!, status: newStatus })
      toast.success(`Task status updated to ${updatedTaskStatus.status}`)
      setTaskStatus(updatedTaskStatus.status)
    } catch (error) {
      console.error("Error updating task status:", error)
      toast.error("Failed to update task status")
    }
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
            {currentContributor.privilege == ContributorPrivileges.PROJECT_MANAGER && (
              <div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text text-lg">Task status</span>
                    <input
                      type="checkbox"
                      checked={taskStatus === TaskStatus.COMPLETED}
                      onChange={handleTaskStatus}
                      className="checkbox checkbox-primary"
                    />
                  </label>
                </div>
                <Modal open={isConfirmModalOpen} size="w-11/12 max-w-3xl">
                  <div className="flex flex-col justify-center items-center space-y-4">
                    <p>
                      Are you sure you want to update the task status since not all assignments are
                      completed?
                    </p>
                    <div className="flex flex-row space-x-4">
                      <button
                        className="btn"
                        onClick={async () => {
                          await taskStatusUpdate()
                          await setIsConfirmModalOpen(false)
                        }}
                      >
                        Confirm
                      </button>
                      <button className="btn" onClick={() => setIsConfirmModalOpen(false)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </Modal>
              </div>
            )}
            {currentContributor.privilege == ContributorPrivileges.CONTRIBUTOR && (
              <p>
                <span className="font-semibold">Task status:</span> {taskStatus}
              </p>
            )}
            <p>
              <span className="font-semibold">Column:</span> {task["column"].name}
            </p>
            <p>
              <span className="font-semibold">Element:</span>{" "}
              {task["element"] ? task["element"].name : "no elements"}
            </p>
            <p className="italic">Last update: {task.updatedAt.toString()}</p>
            <p>
              <span className="font-semibold">Created by (contributor id):</span> {task.createdById}
            </p>
            <p>
              <span className="font-semibold">Deadline:</span>{" "}
              {task.deadline ? task.deadline.toString() : "no deadline"}
            </p>
            <p>
              <span className="font-semibold">Current metadata schema:</span>{" "}
              {task["schema"] ? JSON.stringify(task["schema"]) : "no metadata schema assigned"}
            </p>
          </div>
          {currentContributor.privilege == ContributorPrivileges.PROJECT_MANAGER && (
            <div>
              <h3 className="mb-2">Assignment progress</h3>
              <AssignmentProgress taskId={task.id} />
              <div className="flex justify-start mt-4">
                <Link
                  className="btn"
                  href={Routes.AssignmentsPage({ projectId: projectId!, taskId: task.id })}
                >
                  Assignments
                </Link>
              </div>
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

          <div className="divider">Complete your assignment</div>

          {task["schema"] && currentAssignments && (
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

          {!task["schema"] && currentAssignments && individualAssignments.length > 0 && (
            <div className="flex flex-col gap-2">
              <CompleteToggle
                currentAssignment={individualAssignments[0]!.statusLogs[0]}
                refetch={refetchAssignments}
                completedLabel="Completed as an individual"
                completedBy={currentContributor.id}
                completedAs={CompletedAs.INDIVIDUAL}
              />
            </div>
          )}

          {!task["schema"] && currentAssignments && teamAssignments.length > 0 && (
            <div className="flex flex-col gap-2">
              {teamAssignments.map((teamAssignment) => (
                <CompleteToggle
                  key={teamAssignment.id}
                  currentAssignment={teamAssignment.statusLogs[0]}
                  refetch={refetchAssignments}
                  completedLabel={`Completed as ${teamAssignment.team.name} Team`}
                  completedBy={currentContributor.id}
                  completedAs={CompletedAs.TEAM}
                />
              ))}
            </div>
          )}
        </main>
      </Suspense>
    </Layout>
  )
}

ShowTaskPage.authenticate = true

export default ShowTaskPage
