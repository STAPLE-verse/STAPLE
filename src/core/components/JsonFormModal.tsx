import { useState } from "react"
import Modal from "./Modal"
import JsonForm from "src/core/components/JsonForm"
import { Prisma } from "@prisma/client"
import { noSubmitButton } from "src/forms/utils/extendSchema"

interface JsonFormModalProps {
  schema: Prisma.JsonValue | null
  uiSchema: Prisma.JsonValue | null
  metadata?: Prisma.JsonValue | null
  label: string | JSX.Element
  classNames: string
  onSubmit?: (data: any) => Promise<void>
  onError?: (errors: any) => void
  resetHandler?: () => Promise<void>
  modalSize?: string
  submittable?: boolean
}

export const JsonFormModal = ({
  schema,
  uiSchema,
  metadata = {},
  label,
  classNames,
  onSubmit,
  onError,
  resetHandler,
  modalSize = "w-11/12 max-w-5xl",
  submittable = true,
}: JsonFormModalProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
  }

  // Extend uiSchema to hide the submit button if submittable is false
  const extendedUiSchema = submittable ? uiSchema : noSubmitButton(uiSchema)

  // Check if form "completed"
  const isCompleted = metadata && Object.keys(metadata).length > 0

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

      <Modal open={isOpen} size={modalSize}>
        <div className="font-sans">
          <JsonForm
            schema={schema}
            uiSchema={extendedUiSchema}
            formData={metadata}
            onSubmit={submittable ? onSubmit : undefined}
            onError={onError}
          />
        </div>
        <div className="modal-action flex justify-end">
          {resetHandler && (
            <button
              className="btn btn-secondary mr-2"
              onClick={resetHandler}
              disabled={!isCompleted}
            >
              Reset Form Data
            </button>
          )}

          <button type="button" className="btn btn-secondary" onClick={handleToggle}>
            Close
          </button>
        </div>
      </Modal>
    </>
  )
}
