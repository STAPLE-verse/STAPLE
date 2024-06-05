import { useMutation } from "@blitzjs/rpc"
import { TaskStatus } from "db"
import { useState } from "react"
import updateTaskStatus from "../mutations/updateTaskStatus"
import toast from "react-hot-toast"
import { Tooltip } from "react-tooltip"
import Modal from "src/core/components/Modal"

export const CompleteTaskToggle = ({ task, assignmentProgress }) => {
  const [updateTaskStatusMutation] = useMutation(updateTaskStatus)
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
      const updatedTaskStatus = await updateTaskStatusMutation({ id: task.id, status: newStatus })
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

  return (
    <div className="stat place-items-center">
      <div className="stat-title text-2xl text-inherit" data-tooltip-id="status-tool">
        Task Status
      </div>
      <Tooltip
        id="status-tool"
        content="Complete the entire task even if not all contributors have finished"
        className="z-[1099]"
      />
      <div>
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
              <button className="btn btn-secondary" onClick={() => setIsConfirmModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      </div>
      <div className="stat-desc text-lg text-inherit">
        {taskStatus === "COMPLETED" ? "Completed" : "Not Completed"}
      </div>
    </div>
  )
}
