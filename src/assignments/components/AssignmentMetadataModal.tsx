import { useState } from "react"
import Modal from "src/core/components/Modal"

export const AssignmentMetadataModal = ({ metadata }) => {
  const [openModal, setOpenModal] = useState(false)
  const handleToggle = () => {
    setOpenModal((prev) => !prev)
  }
  return (
    <>
      <div className="mt-4">
        <button type="button" className="btn btn-primary" onClick={handleToggle}>
          Edit Form Data
        </button>

        <Modal open={openModal} size="w-11/12 max-w-3xl">
          <div className="modal-action">
            {metadata ? (
              <div>{JSON.stringify(metadata, null, 2)}</div>
            ) : (
              <span>No metadata provided</span>
            )}
            {/* Closes the modal */}
            <button type="button" className="btn btn-primary" onClick={handleToggle}>
              Close
            </button>
          </div>
        </Modal>
      </div>
    </>
  )
}
