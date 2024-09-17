import { useMutation } from "@blitzjs/rpc"
import { Status } from "db"
import { useState } from "react"
import updateStatus from "../mutations/updateStatus"
import toast from "react-hot-toast"
import { Tooltip } from "react-tooltip"
import Modal from "src/core/components/Modal"
import { useTaskContext } from "./TaskContext"
import useAssignmentProgress from "src/tasklogs/hooks/useAssignmentProgress"

export const CompleteTaskToggle = () => {
  const [updateStatusMutation] = useMutation(updateStatus)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

  const { task } = useTaskContext()

  const assignmentProgress = useAssignmentProgress(task)

  const [status, setStatus] = useState(task?.status || Status.NOT_COMPLETED)

  const handleStatus = async () => {
    if (
      assignmentProgress.completed !== assignmentProgress.all &&
      status === Status.NOT_COMPLETED
    ) {
      setIsConfirmModalOpen(true)
    } else {
      await StatusUpdate()
    }
  }

  const StatusUpdate = async () => {
    const newStatus = status === Status.COMPLETED ? Status.NOT_COMPLETED : Status.COMPLETED

    try {
      const updatedStatus = await updateStatusMutation({ id: task.id, status: newStatus })
      toast.success(
        `Task status updated to ${
          updatedStatus.status === "COMPLETED" ? "Completed" : "Not Completed"
        }`
      )
      setStatus(updatedStatus.status)
    } catch (error) {
      console.error("Error updating task status:", error)
      toast.error("Failed to update task status")
    }
  }

  const confirmUpdateStatus = async () => {
    await StatusUpdate()
    setIsConfirmModalOpen(false)
  }

  return (
    <div className="stat place-items-center">
      <div className="stat-title text-2xl text-inherit" data-tooltip-id="status-tool">
        Task Status
      </div>
      <Tooltip
        id="status-tool"
        content="Complete the entire task even if not all contributors have finished"
        className="z-[1099] ourtooltips"
      />
      <div>
        <input
          type="checkbox"
          checked={status === Status.COMPLETED}
          onChange={handleStatus}
          className="checkbox checkbox-primary border-2"
        />
        <Modal open={isConfirmModalOpen} size="w-11/12 max-w-3xl">
          <div className="flex flex-col justify-center items-center space-y-4">
            <p>
              Are you sure you want to update the task status since not all assignments are
              completed?
            </p>
            <div className="flex flex-row space-x-4">
              <button className="btn btn-primary" onClick={confirmUpdateStatus}>
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
        {status === "COMPLETED" ? "Completed" : "Not Completed"}
      </div>
    </div>
  )
}
