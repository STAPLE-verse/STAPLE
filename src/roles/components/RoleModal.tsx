import React, { useState } from "react"
import Modal from "src/core/components/Modal"
import { RoleForm } from "./RoleForm"
import { RoleFormSchema } from "../schemas"
import { PencilSquareIcon } from "@heroicons/react/24/outline"

interface RoleModalProps {
  initialValues: {
    name: string
    description: string
    taxonomy: string
  }
  taxonomyList: string[]
  submitText: string
  title: string
  onSubmit: (values: any) => Promise<any>
}

export const RoleModal: React.FC<RoleModalProps> = ({
  initialValues,
  taxonomyList,
  submitText,
  title,
  onSubmit,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleModal = () => setIsOpen((prev) => !prev)

  return (
    <>
      <button type="button" className="btn btn-ghost" onClick={toggleModal}>
        {submitText === "Create Role" ? (
          "New Role"
        ) : (
          <PencilSquareIcon width={25} className="stroke-primary" />
        )}
      </button>

      <Modal open={isOpen} size="w-1/3 max-w-1/2">
        <div>
          <h1 className="flex justify-center mb-2 text-3xl">{title}</h1>
          <div className="flex justify-start mt-4">
            <RoleForm
              schema={RoleFormSchema}
              submitText={submitText}
              className="flex flex-col w-full"
              onSubmit={onSubmit}
              initialValues={initialValues}
              taxonomyList={taxonomyList}
            />
          </div>
          <div className="modal-action flex justify-end mt-4">
            <button type="button" className="btn btn-secondary" onClick={toggleModal}>
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
