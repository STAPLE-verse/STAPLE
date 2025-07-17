import { useMutation } from "@blitzjs/rpc"
import { Status } from "db"
import { useEffect, useState } from "react"
import updateTaskStatus from "../mutations/updateTaskStatus"
import toast from "react-hot-toast"
import Modal from "src/core/components/Modal"
import { useTaskContext } from "./TaskContext"
import Stat from "src/core/components/Stat"

export const CompleteTaskToggle = () => {
  const [updateStatusMutation] = useMutation(updateTaskStatus)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

  const { task, projectMembers, taskLogProgress } = useTaskContext()

  const [status, setStatus] = useState(task?.status || Status.NOT_COMPLETED)

  useEffect(() => {
    setStatus(task?.status || Status.NOT_COMPLETED)
  }, [task?.status])

  const handleStatus = async () => {
    if (taskLogProgress.completed !== taskLogProgress.all && status === Status.NOT_COMPLETED) {
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
    <Stat
      title="Task Status"
      tooltipContent="Complete the entire task even if not all contributors have finished"
      description={status === Status.COMPLETED ? "Completed" : "Not Completed"}
      className="place-items-center"
    >
      <>
        <input
          type="checkbox"
          checked={status === Status.COMPLETED}
          onChange={handleStatus}
          className="checkbox checkbox-primary border-2 mt-2"
        />
        <Modal open={isConfirmModalOpen} size="w-11/12 max-w-3xl">
          <div className="flex flex-col justify-center items-center space-y-4">
            <p>
              Are you sure you want to update the task status since not all individual tasks are
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
      </>
    </Stat>
  )
}
