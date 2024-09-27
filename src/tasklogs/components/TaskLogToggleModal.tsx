import Modal from "src/core/components/Modal"
import CompleteToggle from "./CompleteToggle"
import { useState } from "react"
import { useParam } from "@blitzjs/next"
import { CompletedAs } from "db"
import { useCurrentProjectMember } from "src/projectmembers/hooks/useCurrentProjectMember"

export const TaskLogToggleModal = ({ taskLog }) => {
  const [openModal, setOpenModal] = useState(false)
  const projectId = useParam("projectId", "number")
  const { projectMember: currentProjectMember } = useCurrentProjectMember(projectId)

  // Handle events
  const handleToggle = () => {
    setOpenModal((prev) => !prev)
  }
  const handleToggleClose = () => {
    setOpenModal((prev) => !prev)
  }

  return (
    <>
      <div className="mt-4">
        <button type="button" className="btn btn-primary" onClick={handleToggle}>
          Edit Completion
        </button>
        <Modal open={openModal} size="w-11/12 max-w-3xl">
          <div className="modal-action justify-between">
            <CompleteToggle
              taskLog={taskLog}
              completedRole="Completed"
              completedById={currentProjectMember!.id}
              completedAs={taskLog.name ? CompletedAs.TEAM : CompletedAs.INDIVIDUAL}
            />
            <button type="button" className="btn btn-primary" onClick={handleToggleClose}>
              Close
            </button>
          </div>
        </Modal>
      </div>
    </>
  )
}
