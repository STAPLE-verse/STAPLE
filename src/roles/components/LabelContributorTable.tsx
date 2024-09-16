import React, { useState } from "react"
import { createColumnHelper } from "@tanstack/react-table"
import Modal from "src/core/components/Modal"
import { FORM_ERROR } from "final-form"
import toast from "react-hot-toast"
import { useMutation } from "@blitzjs/rpc"
import { AddLabelForm } from "./AddLabelForm"
import { LabelIdsFormSchema } from "../schemas"
import { MultipleCheckboxColumn } from "./LabelTaskTable"
import updateContributorLabel from "src/projectmembers/mutations/updateContributorLabel"
import { useParam } from "@blitzjs/next"

export type Label = {
  name: string
}

export type ContributorLabelInformation = {
  username: string
  firstname?: string
  lastname?: string
  labels?: Label[]
  id: number
  onChangeCallback?: () => void
  selectedIds: number[]
  onMultipledAdded?: (selectedId) => void
}

const AddLabelsColumn = ({ row }) => {
  const projectId = useParam("projectId", "number")
  const [updateContributorLabelMutation] = useMutation(updateContributorLabel)
  const {
    name = "",
    description = "",
    id = null,
    checked = false,
    onChangeCallback = undefined,
    ...rest
  } = { ...row }

  const [openEditLabelModal, setOpenEditLabelModal] = useState(false)
  const handleToggleEditLabelModal = () => {
    setOpenEditLabelModal((prev) => !prev)
  }

  const labelsId = row.labels.map((label) => label.id)
  const initialValues = {
    labelsId: labelsId,
  }

  const handleAddLabel = async (values) => {
    try {
      const updated = await updateContributorLabelMutation({
        labelsId: values.labelsId,
        contributorsId: [row.id],
        disconnect: true,
      })
      if (onChangeCallback != undefined) {
        onChangeCallback()
      }
      await toast.promise(Promise.resolve(updated), {
        loading: "Adding roles to contributors...",
        success: "Roles added!",
        error: "Failed to add the roles...",
      })
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  return (
    <div className="modal-action flex justify-start mt-4">
      <div>
        <button
          type="button"
          /* button for popups */
          className="btn btn-primary"
          onClick={handleToggleEditLabelModal}
        >
          Add Role
        </button>
      </div>
      <Modal open={openEditLabelModal} size="w-7/8 max-w-xl">
        <div className="">
          <h1 className="flex justify-center mb-2 text-3xl">Add Roles</h1>
          <div className="flex justify-start mt-4">
            <AddLabelForm
              projectId={projectId}
              schema={LabelIdsFormSchema}
              submitText="Update Role"
              className="flex flex-col"
              onSubmit={handleAddLabel}
              initialValues={initialValues}
            ></AddLabelForm>
          </div>

          {/* closes the modal */}
          <div className="modal-action flex justify-end mt-4">
            <button
              type="button"
              /* button for popups */
              className="btn btn-secondary"
              onClick={handleToggleEditLabelModal}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

const columnHelper = createColumnHelper<ContributorLabelInformation>()

// ColumnDefs
export const labelContributorTableColumns = [
  columnHelper.accessor("username", {
    id: "username",
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Username",
  }),

  columnHelper.accessor("firstname", {
    id: "firstname",
    cell: (info) => <span>{info.getValue()}</span>,
    header: "First Name",
  }),
  columnHelper.accessor("lastname", {
    id: "lastaname",
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Last Name",
  }),
  columnHelper.accessor(
    (row) => {
      const labels = row.labels || []
      return labels.map((label) => label.name).join(", ") // Combine all label names into a single string
    },
    {
      id: "labels",
      header: "Roles",
      cell: (info) => <div>{info.getValue()}</div>,
      enableColumnFilter: true,
    }
  ),
  columnHelper.accessor("id", {
    id: "open",
    header: "Add Role",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <AddLabelsColumn row={info.row.original}></AddLabelsColumn>,
  }),
  columnHelper.accessor("id", {
    id: "multiple",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <MultipleCheckboxColumn row={info.row.original}></MultipleCheckboxColumn>,
    header: "Add Multiple",
  }),
]
