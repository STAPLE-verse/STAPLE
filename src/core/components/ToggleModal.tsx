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
  onClose?: () => void
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
  onClose,
}: ToggleModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleModal = () => {
    setIsOpen((prev) => {
      const next = !prev
      if (!prev && onOpen) onOpen()
      if (prev && onClose) onClose()
      return next
    })
  }

  return (
    <div key={key}>
      <button type="button" className={`btn btn-primary ${buttonClassName}`} onClick={toggleModal}>
        {buttonLabel}
      </button>
      <Modal open={isOpen} size={modalSize}>
        <div className="relative z-[9999] bg-base-100 p-4 rounded-lg shadow-lg">
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
        <div className="fixed inset-0 pointer-events-none bg-black/50 backdrop-blur-sm z-[9998]"></div>
      </Modal>
    </div>
  )
}

export default ToggleModal
