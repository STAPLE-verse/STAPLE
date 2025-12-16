import { useQuery } from "@blitzjs/rpc"
import { User } from "db"
import React, { useState } from "react"
import Modal from "src/core/components/Modal"
import TooltipWrapper from "src/core/components/TooltipWrapper"
import RadioFieldTable from "src/core/components/fields/RadioFieldTable"
import getForms, { FormWithFormVersion } from "src/forms/queries/getForms"

export interface FormWithVersionAndUser extends FormWithFormVersion {
  user: User | null
}

interface TaskSchemaInputProps {
  projectManagerIds: number[]
  className?: string
  tooltipContent: string
}

export const TaskSchemaInput = ({
  projectManagerIds,
  className,
  tooltipContent,
}: TaskSchemaInputProps) => {
  const [openSchemaModal, setOpenSchemaModal] = useState(false)
  const handleToggleSchemaUpload = () => setOpenSchemaModal((prev) => !prev)

  const [{ forms: pmForms }] = useQuery(getForms, {
    where: { userId: { in: projectManagerIds }, archived: false },
    include: { user: true },
  })

  const typedPmForms = pmForms as FormWithVersionAndUser[]

  // Build a lookup from formVersion.id -> PM username for fast, reliable access
  const versionIdToUsername = new Map<number, string>()
  typedPmForms.forEach((form) => {
    const username =
      (form.user?.firstName && form.user?.lastName
        ? `${form.user.firstName} ${form.user.lastName}`
        : form.user?.username) ?? ""
    const versions = Array.isArray(form.formVersion)
      ? form.formVersion
      : form.formVersion
      ? [form.formVersion]
      : []
    versions.forEach((fv: any) => {
      if (fv?.id != null) {
        versionIdToUsername.set(fv.id, username)
      }
    })
  })

  const schemas = typedPmForms
    .filter((form) => form.formVersion)
    .flatMap((form) => form.formVersion!)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const options = schemas.map((schema) => ({ id: schema.id, label: schema.name }))

  // Extra columns for the select table
  const extraData = schemas.map((schema) => ({
    version: schema.version,
    username: versionIdToUsername.get(schema.id) ?? "",
    date: new Date(schema.createdAt).toLocaleDateString(),
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
    {
      id: "date",
      header: "Created",
      accessorKey: "date",
      cell: (info) => <span>{info.getValue()}</span>,
    },
  ]

  return (
    <div>
      <TooltipWrapper
        id="form-tooltip"
        content={tooltipContent}
        className="z-[1099] ourtooltips"
        place="right"
        opacity={1}
      />
      <button
        type="button"
        data-tooltip-id="form-tooltip"
        className={`btn btn-primary w-1/2 ${className ?? ""}`}
        onClick={handleToggleSchemaUpload}
      >
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

            <button
              type="button"
              className="btn btn-info self-end"
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

export default TaskSchemaInput
