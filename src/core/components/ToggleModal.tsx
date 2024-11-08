import Modal from "src/core/components/Modal"
import { useState } from "react"

interface ToggleModalProps {
  buttonLabel: string
  modalTitle: string
  children: React.ReactNode
}

const ToggleModal = ({ buttonLabel, modalTitle, children }: ToggleModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleModal = () => setIsOpen((prev) => !prev)

  return (
    <div>
      <button type="button" className="btn btn-primary w-1/2" onClick={toggleModal}>
        {buttonLabel}
      </button>
      <Modal open={isOpen} size="w-7/8 max-w-xl">
        <div>
          <h1 className="flex justify-center mb-2 text-3xl">{modalTitle}</h1>
          <div className="flex justify-start mt-4">{children}</div>
          <div className="modal-action flex justify-end mt-4">
            <button type="button" className="btn btn-primary" onClick={toggleModal}>
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ToggleModal
