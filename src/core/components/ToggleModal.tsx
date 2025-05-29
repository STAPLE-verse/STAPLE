import Modal from "src/core/components/Modal"
import { useState } from "react"

interface ToggleModalProps {
  buttonLabel: string
  modalTitle: string
  children?: React.ReactNode
  modalSize?: string
  buttonClassName?: string
  saveButton?: boolean
  key?: string | number // Add key as an optional prop
  onOpen?: () => void
}

const ToggleModal = ({
  buttonLabel,
  modalTitle,
  children,
  modalSize = "w-7/8 max-w-xl",
  buttonClassName = "",
  saveButton,
  key, // Accept key as a prop
  onOpen,
}: ToggleModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleModal = () => {
    setIsOpen((prev) => {
      const next = !prev
      if (!prev && onOpen) onOpen()
      return next
    })
  }

  return (
    <div key={key}>
      <button type="button" className={`btn btn-primary ${buttonClassName}`} onClick={toggleModal}>
        {buttonLabel}
      </button>
      <Modal open={isOpen} size={modalSize}>
        <div>
          <h1 className="flex justify-center mb-2 text-3xl">{modalTitle}</h1>
          <div className="flex justify-start mt-4">{children}</div>
          <div className="modal-action flex justify-end mt-4">
            {saveButton && (
              <button type="button" className="btn btn-primary" onClick={toggleModal}>
                Save
              </button>
            )}
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
