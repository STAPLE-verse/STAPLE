import React, { useState } from "react"
import { Form, FormProps } from "src/core/components/fields/Form"
import { z } from "zod"
import { LabelSelectField } from "src/core/components/fields/LabelSelectField"
import { useQuery } from "@blitzjs/rpc"
import { MemberPrivileges } from "@prisma/client"
import getLabels from "src/labels/queries/getLabels"
import Modal from "src/core/components/Modal"
import CheckboxFieldTable from "src/core/components/fields/CheckboxFieldTable"
import LabeledTextField from "src/core/components/fields/LabeledTextField"
import { Tooltip } from "react-tooltip"
import getContributors from "../queries/getContributors"

interface ContributorFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  projectId: number
  isEdit?: boolean
}

export const MemberPrivilegesOptions = [
  { id: 0, value: MemberPrivileges.PROJECT_MANAGER, label: "Project Manager" },
  { id: 1, value: MemberPrivileges.CONTRIBUTOR, label: "Contributor" },
]

export function ContributorForm<S extends z.ZodType<any, any>>(props: ContributorFormProps<S>) {
  const { projectId, isEdit = false, ...formProps } = props

  // need all labels from all PMs for this project
  // Contributors
  const [{ contributors }] = useQuery(getContributors, {
    where: { project: { id: projectId! } },
    include: {
      user: true,
    },
  })
  // get all labels from all PMs
  const projectManagers = contributors.filter(
    (contributor) => contributor.privilege === "PROJECT_MANAGER"
  )
  const pmIds = projectManagers.map((pm) => pm.userId)
  const [{ labels }] = useQuery(getLabels, {
    where: {
      userId: {
        in: pmIds, // Filter labels where userId is in the list of PM IDs
      },
    },
    include: {
      contributors: true, // Optional: include contributor data if needed
      user: true,
    },
  })

  const labelMerged = labels.map((labels) => {
    return {
      pm: labels["user"]["username"],
      label: labels["name"],
      id: labels["id"],
    }
  })

  const extraData = labelMerged.map((item) => ({
    pm: item.pm,
  }))

  const labelOptions = labelMerged.map((item) => ({
    label: item.label,
    id: item.id,
  }))

  const extraColumns = [
    {
      id: "pm",
      header: "Project Manager",
      accessorKey: "pm",
      cell: (info) => <span>{info.getValue()}</span>,
    },
  ]

  const [openLabelsModal, setlabelsModal] = useState(false)
  const handleToggleLabelsModal = () => {
    setlabelsModal((prev) => !prev)
  }

  return (
    <Form<S> {...formProps}>
      <Tooltip
        id="priv-tooltip"
        content="Project Managers can see and edit
      all parts of a project, while contributors can only complete
      tasks assigned to them."
        className="z-[1099] ourtooltips"
        place="right"
        opacity={1}
      />
      <Tooltip
        id="role-tooltip"
        content="Add role labels to individual contributors (like administration)"
        className="z-[1099] ourtooltips"
        place="right"
        opacity={1}
      />
      {!isEdit && (
        <LabeledTextField
          name="email"
          label="Email: (Required)"
          placeholder="Email"
          type="text"
          className="input mb-4 w-1/2 text-primary input-primary input-bordered border-2 bg-base-300"
        />
      )}
      <LabelSelectField
        className="select text-primary select-bordered border-primary border-2 w-1/2 mt-4 bg-base-300"
        name="privilege"
        label="Select Privilege: (Required)"
        options={MemberPrivilegesOptions}
        optionText="label"
        optionValue="value"
        type="string"
        data-tooltip-id="priv-tooltip"
      />
      <div className="mt-4">
        <button
          type="button"
          className="btn btn-primary w-1/2"
          data-tooltip-id="role-tooltip"
          onClick={() => handleToggleLabelsModal()}
        >
          Add Role
        </button>
        <Modal open={openLabelsModal} size="w-7/8 max-w-xl">
          <div className="">
            <div className="flex justify-start mt-4">
              <CheckboxFieldTable
                name="labelsId"
                options={labelOptions}
                extraColumns={extraColumns}
                extraData={extraData}
              />
            </div>
            {/* closes the modal */}
            <div className="modal-action flex justify-end mt-4">
              <button type="button" className="btn btn-primary" onClick={handleToggleLabelsModal}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </Form>
  )
}
