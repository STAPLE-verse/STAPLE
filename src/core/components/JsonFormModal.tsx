import { useState } from "react"
import Modal from "./Modal"
import JsonForm from "src/core/components/JsonForm"
import { Prisma } from "@prisma/client"

interface JsonFormModalProps {
  schema: Prisma.JsonValue | null
  uiSchema: Prisma.JsonValue | null
  metadata?: Prisma.JsonValue | null
  label: string | JSX.Element
  classNames: string
}

export const JsonFormModal = ({
  schema,
  uiSchema,
  metadata = {},
  label,
  classNames,
}: JsonFormModalProps) => {
  const [openModal, setOpenModal] = useState(false)

  const handleToggle = () => {
    setOpenModal((prev) => !prev)
  }

  return (
    <>
      <button
        type="button"
        className={`btn ${classNames}`}
        onClick={handleToggle}
        data-testid="jsonformmodal-btid"
      >
        {label}
      </button>

      <Modal open={openModal}>
        <div className="modal-action flex flex-col">
          <div className="font-sans">
            {<JsonForm schema={schema} uiSchema={uiSchema} formData={metadata} />}
          </div>
          {/* Closes the modal */}
          <div className="flex justify-end">
            <button type="button" className="btn btn-secondary" onClick={handleToggle}>
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
