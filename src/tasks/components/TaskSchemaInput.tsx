import { useQuery } from "@blitzjs/rpc"
import { User } from "db"
import React, { useState } from "react"
import Modal from "src/core/components/Modal"
import RadioFieldTable from "src/core/components/fields/RadioFieldTable"
import getForms, { FormWithFormVersion } from "src/forms/queries/getForms"

export interface FormWithVersionAndUser extends FormWithFormVersion {
  user: User | null
}

interface TaskSchemaInputProps {
  projectManagerIds: number[]
}

export const TaskSchemaInput = ({ projectManagerIds }: TaskSchemaInputProps) => {
  const [openSchemaModal, setOpenSchemaModal] = useState(false)
  const handleToggleSchemaUpload = () => setOpenSchemaModal((prev) => !prev)

  const [pmForms] = useQuery(getForms, {
    where: { userId: { in: projectManagerIds }, archived: false },
    include: { user: true },
  })

  const typedPmForms = pmForms as FormWithVersionAndUser[]

  const schemas = typedPmForms
    .filter((form) => form.formVersion)
    .flatMap((form) => form.formVersion!)

  const options = schemas.map((schema) => ({ id: schema.id, label: schema.name }))

  // Extra columns for the select table
  const versionNumber = schemas.map((schema) => schema.version)

  const pmNames = typedPmForms
    .filter((form) => form.formVersion) // Keep only forms where formVersion is defined
    .map((form) => form.user?.username) // Map to the username

  const extraData = versionNumber.map((version, index) => ({
    version: version,
    username: pmNames[index], // Safely access pmNames[index]
  }))

  const extraColumns = [
    {
      id: "version",
      header: "Version",
      accessorKey: "version",
      cell: (info) => <span>{info.getValue()}</span>,
    },
    {
      id: "pm",
      header: "Project Manager",
      accessorKey: "username",
      cell: (info) => <span>{info.getValue()}</span>,
    },
  ]

  return (
    <div>
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
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default TaskSchemaInput
