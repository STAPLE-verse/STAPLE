
import React, { useState } from "react"
import { Form, FormProps } from "src/core/components/fields/Form"
import { z } from "zod"
import { LabelSelectField } from "src/core/components/fields/LabelSelectField"
import { useQuery } from "@blitzjs/rpc"
import getUsers from "src/users/queries/getUsers"
import { ContributorPrivileges } from "@prisma/client"
import getLabels from "src/labels/queries/getLabels"
import Modal from "src/core/components/Modal"
import CheckboxFieldTable from "src/core/components/fields/CheckboxFieldTable"


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

  const [users] = useQuery(
    getUsers,
    {
      where: {
        NOT: {
          contributions: {
            some: {
              project: {
                id: projectId,
              },
            },
          },
        },
      },
    },
    // Only run query if useers are needed for the field
    { enabled: !isEdit }
  )

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
      {!isEdit && (
        <LabelSelectField
          className="select text-primary select-bordered w-1/2 mt-4 mb-4"
          name="userId"
          label="Select User:"
          options={users}
          optionText="username"
          optionValue="id"
        />
      )}
      <LabelSelectField
        className="select text-primary select-bordered w-1/2 mt-4"
        name="privilege"
        label="Select Privilege:"
        options={ContributorPrivilegesOptions}
        optionText="label"
        optionValue="value"
        type="string"
      />

      <div className="mt-4">
        <button
          type="button"
          className="btn btn-primary w-1/2"
          onClick={() => handleToggleLabelsModal()}
        >
          Add Label
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
