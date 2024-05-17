import { useState } from "react"
import Modal from "./Modal"
import JsonForm from "src/assignments/components/JsonForm"

export const JsonFormModal = ({ schema, uiSchema, metadata, label }) => {
  const [openModal, setOpenModal] = useState(false)

  const handleToggle = () => {
    setOpenModal((prev) => !prev)
  }

  return (
    <>
      <div>
        <button type="button" className="btn btn-primary" onClick={handleToggle}>
          {label}
        </button>

        <Modal open={openModal} size="w-11/12 max-w-3xl">
          <div className="modal-action flex flex-col">
            <div className="font-sans">
              {<JsonForm schema={schema} uiSchema={uiSchema} formData={metadata ? metadata : {}} />}
            </div>
            {/* Closes the modal */}
            <div className="flex justify-end">
              <button type="button" className="btn btn-primary" onClick={handleToggle}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  )
}
