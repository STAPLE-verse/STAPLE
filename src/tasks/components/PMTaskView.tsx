//imports
import { useQuery, useMutation } from "@blitzjs/rpc"
import deleteTask from "src/tasks/mutations/deleteTask"
import { CompletedAs, TaskStatus, AssignmentStatus } from "@prisma/client"
import { useState } from "react"
import getTask from "src/tasks/queries/getTask"
import { useParam } from "@blitzjs/next"
import Modal from "src/core/components/Modal"
import AssignmentProgress from "src/tasks/components/AssignmentProgress"
import toast from "react-hot-toast"
import getAssignmentProgress from "src/assignments/queries/getAssignmentProgress"
import updateTaskStatus from "src/tasks/mutations/updateTaskStatus"
import JsonForm from "src/assignments/components/JsonForm"
import getJsonSchema from "src/services/jsonconverter/getJsonSchema"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useRouter } from "next/router"

// create task view
export const PMTaskView = () => {
  const router = useRouter()
  const taskId = useParam("taskId", "number")
  const projectId = useParam("projectId", "number")
  const [deleteTaskMutation] = useMutation(deleteTask)
  const [updateTaskStatusMutation] = useMutation(updateTaskStatus)
  const [task] = useQuery(getTask, { id: taskId, include: { element: true, column: true } })
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
      toast.success(
        `Task status updated to ${
          updatedTaskStatus.status === "COMPLETED" ? "Completed" : "Not Completed"
        }`
      )
      setTaskStatus(updatedTaskStatus.status)
    } catch (error) {
      console.error("Error updating task status:", error)
      toast.error("Failed to update task status")
    }
  }
  const [openMetadataInspectModal, setOpenMetadataInspectModal] = useState(false)
  const handleMetadataInspectToggle = () => {
    setOpenMetadataInspectModal((prev) => !prev)
  }
  // Get assignments
  const [assignmentProgress, { refetch: refetchAssignmentProgress }] = useQuery(
    getAssignmentProgress,
    { taskId: taskId! }
  )

  return (
    <div className="flex flex-row justify-center m-2">
      {/* overall project information */}
      <div className="card bg-base-300 mx-2 w-full">
        <div className="card-body">
          <div className="card-title">PM Information</div>

          <div class="stats bg-base-300 text-lg font-bold">
            <div class="stat place-items-center">
              <div class="stat-title text-2xl">Task Status</div>
              <div class="stat-value">
                <input
                  type="checkbox"
                  checked={taskStatus === TaskStatus.COMPLETED}
                  onChange={handleTaskStatus}
                  className="checkbox checkbox-primary border-2"
                />
                <Modal open={isConfirmModalOpen} size="w-11/12 max-w-3xl">
                  <div className="flex flex-col justify-center items-center space-y-4">
                    <p>
                      Are you sure you want to update the task status since not all assignments are
                      completed?
                    </p>
                    <div className="flex flex-row space-x-4">
                      <button
                        className="btn btn-primary"
                        onClick={async () => {
                          await taskStatusUpdate()
                          await setIsConfirmModalOpen(false)
                        }}
                      >
                        Confirm
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setIsConfirmModalOpen(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </Modal>
              </div>
              <div class="stat-desc text-lg text-base">
                {taskStatus === "COMPLETED" ? "Completed" : "Not Completed"}
              </div>
            </div>
          </div>

          <div className="form-control">
            <span className="font-semibold"> </span>
          </div>

          <p>
            <span className="font-semibold">Current metadata schema:</span>{" "}
            {task["schema"] ? (
              <div>
                <button className="btn btn-primary" onClick={() => handleMetadataInspectToggle()}>
                  Review
                </button>
                <Modal open={openMetadataInspectModal} size="w-11/12 max-w-5xl">
                  <div className="font-sans">
                    {<JsonForm schema={getJsonSchema(task["schema"])} uiSchema={task["ui"]} />}
                  </div>
                  <div className="modal-action">
                    <button className="btn btn-primary" onClick={handleMetadataInspectToggle}>
                      Close
                    </button>
                  </div>
                </Modal>
              </div>
            ) : (
              "no metadata schema assigned"
            )}
          </p>

          <div>
            <h3 className="mb-2">Assignment progress</h3>
            <AssignmentProgress taskId={task.id} />
            <div className="flex justify-start mt-4">
              <Link
                className="btn btn-primary"
                href={Routes.AssignmentsPage({ projectId: projectId!, taskId: task.id })}
              >
                Review
              </Link>
            </div>
          </div>

          <div className="flex flex-row justify-end mt-4 space-x-4">
            <Link
              className="btn btn-primary"
              href={Routes.EditTaskPage({ projectId: projectId!, taskId: task.id })}
            >
              Update task
            </Link>
            <button
              type="button"
              className="btn btn-secondary"
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
        </div>
      </div>
    </div>
  )
}
