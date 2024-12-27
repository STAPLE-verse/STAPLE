import { useQuery } from "@blitzjs/rpc"
import React, { useState } from "react"
import Modal from "src/core/components/Modal"
import RadioFieldTable from "src/core/components/fields/RadioFieldTable"
import { FormWithVersionAndUser } from "src/tasks/components/TaskSchemaInput"
import getForms from "src/forms/queries/getForms"

interface ProjectSchemaInputProps {
  userId: number
}

export const ProjectSchemaInput = ({ userId }: ProjectSchemaInputProps) => {
  const [openSchemaModal, setOpenSchemaModal] = useState(false)
  const handleToggleSchemaUpload = () => setOpenSchemaModal((prev) => !prev)

  const [userForms] = useQuery(getForms, {
    where: { userId: { in: userId }, archived: false },
  })

  const typeduserForms = userForms as FormWithVersionAndUser[]

  const schemas = typeduserForms
    .filter((form) => form.formVersion)
    .flatMap((form) => form.formVersion!)

  const options = schemas.map((schema) => ({ id: schema.id, label: schema.name }))

  // Extra columns for the select table
  const versionNumber = schemas.map((schema) => schema.version)

  const extraData = versionNumber.map((version) => ({
    version: version,
  }))

  const extraColumns = [
    {
      id: "version",
      header: "Version",
      accessorKey: "version",
      cell: (info) => <span>{info.getValue()}</span>,
    },
  ]

  return (
    <div className="mt-4">
      <button type="button" className="btn btn-primary w-1/2" onClick={handleToggleSchemaUpload}>
        Assign Form
      </button>
      <Modal open={openSchemaModal} size="w-1/2">
        <div>
          <h1 className="flex justify-center mb-2 text-3xl">Select Form</h1>
          <RadioFieldTable
            name="formVersionId"
            options={options}
            extraColumns={extraColumns}
            extraData={extraData}
          />
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-primary self-end"
              onClick={handleToggleSchemaUpload}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ProjectSchemaInput
