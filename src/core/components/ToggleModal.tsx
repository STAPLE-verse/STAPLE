import Modal from "src/core/components/Modal"
import { useState } from "react"

interface ToggleModalProps {
  buttonLabel: string
  modalTitle: string
  children: React.ReactNode
  modalSize?: string
  buttonClassName?: string
}

const ToggleModal = ({
  buttonLabel,
  modalTitle,
  children,
  modalSize = "w-7/8 max-w-xl",
  buttonClassName = "",
}: ToggleModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleModal = () => setIsOpen((prev) => !prev)

  return (
    <div>
      <button type="button" className={`btn btn-primary ${buttonClassName}`} onClick={toggleModal}>
        {buttonLabel}
      </button>
      <Modal open={isOpen} size={modalSize}>
        <div>
          <h1 className="flex justify-center mb-2 text-3xl">{modalTitle}</h1>
          <div className="flex justify-start mt-4">{children}</div>
          <div className="modal-action flex justify-end mt-4">
            <button type="button" className="btn btn-secondary" onClick={toggleModal}>
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ToggleModal
