import Modal from "src/core/components/Modal"
import CompleteToggle from "./CompleteToggle"
import { useState } from "react"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import getContributor from "src/projectmembers/queries/getContributor"
import { CompletedAs } from "db"

export const AssignmentToggleModal = ({ assignment }) => {
  const [openModal, setOpenModal] = useState(false)
  const currentUser = useCurrentUser()
  const projectId = useParam("projectId", "number")
  const [currentContributor] = useQuery(getContributor, {
    where: { projectId: projectId, userId: currentUser!.id },
  })

  // Handle events
  const handleToggle = () => {
    setOpenModal((prev) => !prev)
  }
  const handleToggleClose = () => {
    setOpenModal((prev) => !prev)
    // window.location.reload()
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
              currentAssignment={assignment}
              completedRole="Completed"
              completedBy={currentContributor.id}
              completedAs={assignment.teamId ? CompletedAs.TEAM : CompletedAs.INDIVIDUAL}
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
