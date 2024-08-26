import { useQuery } from "@blitzjs/rpc"
import { ContributorPrivileges } from "db"
import React, { useState } from "react"
import Modal from "src/core/components/Modal"
import RadioFieldTable from "src/core/components/fields/RadioFieldTable"
import getForms from "src/forms/queries/getForms"

export const TaskSchemaInput = ({ contributors }) => {
  const [openSchemaModal, setOpenSchemaModal] = useState(false)
  const handleToggleSchemaUpload = () => setOpenSchemaModal((prev) => !prev)

  // Get forms data
  const pmList = contributors
    .filter((contributor) => contributor.privilege === ContributorPrivileges.PROJECT_MANAGER)
    .map((pm) => pm.userId)

  const [pmForms] = useQuery(getForms, {
    where: { userId: { in: pmList } },
  })

  const schemas = pmForms.forms
    .filter((form) => form.formVersion)
    .flatMap((form) => form.formVersion!)

  const options = schemas.map((schema) => ({ id: schema.id, label: schema.name }))

  // Extra columns for the select table
  const extraData = schemas.map((schema) => ({ version: schema.version }))

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
      <Modal open={openSchemaModal} size="w-11/12 max-w-1xl">
        <div>
          <h1 className="flex justify-center mb2 text-3xl">Select Form</h1>
          <RadioFieldTable
            name="formVersionId"
            options={options}
            extraColumns={extraColumns}
            extraData={extraData}
          />
          <div className="modal-action">
            <button type="button" className="btn btn-primary" onClick={handleToggleSchemaUpload}>
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default TaskSchemaInput
