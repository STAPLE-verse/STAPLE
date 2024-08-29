import React, { useState } from "react"
import { Form, FormProps } from "src/core/components/fields/Form"
import { z } from "zod"
import { LabelSelectField } from "src/core/components/fields/LabelSelectField"
import { useQuery } from "@blitzjs/rpc"
import { ContributorPrivileges } from "@prisma/client"
import getLabels from "src/labels/queries/getLabels"
import Modal from "src/core/components/Modal"
import CheckboxFieldTable from "src/core/components/fields/CheckboxFieldTable"
import LabeledTextField from "src/core/components/fields/LabeledTextField"
import { Tooltip } from "react-tooltip"

interface ContributorFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  projectId: number
  isEdit?: boolean
}

export const ContributorPrivilegesOptions = [
  { id: 0, value: ContributorPrivileges.PROJECT_MANAGER, label: "Project Manager" },
  { id: 1, value: ContributorPrivileges.CONTRIBUTOR, label: "Contributor" },
]

export function ContributorForm<S extends z.ZodType<any, any>>(props: ContributorFormProps<S>) {
  const { projectId, isEdit = false, ...formProps } = props

  const [{ labels }] = useQuery(getLabels, {
    where: {
      projects: { some: { id: { in: projectId! } } },
    },
  })

  const labelOptions = labels.map((labels) => {
    return {
      label: labels["name"],
      id: labels["id"],
    }
  })

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
        className="z-[1099]"
        place="right"
        opacity={1}
      />
      <Tooltip
        id="role-tooltip"
        content="Add role labels to individual contributors (like administration)"
        className="z-[1099]"
        place="right"
        opacity={1}
      />
      {!isEdit && (
        <LabeledTextField
          name="email"
          label="Email: (Required)"
          placeholder="Email"
          type="text"
          className="mb-4 text-primary border-primary border-2 bg-base-300 w-1/2 "
        />
      )}
      <LabelSelectField
        className="select text-primary select-bordered border-primary border-2 w-1/2 mt-4"
        name="privilege"
        label="Select Privilege: (Required)"
        options={ContributorPrivilegesOptions}
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
              <CheckboxFieldTable name="labelsId" options={labelOptions} />
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
