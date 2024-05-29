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

// create task view
export const PMTaskView = () => {
  const taskId = useParam("taskId", "number")
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

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text text-lg">Task Status</span>
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
      </div>
    </div>
  )
}
