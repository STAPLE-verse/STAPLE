import React, { useState } from "react"
import { Task } from "db"

import { RowSelection, createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import Modal from "src/core/components/Modal"
import { LabelForm } from "./LabelForm"
import { FORM_ERROR } from "final-form"

import toast from "react-hot-toast"
import updateLabel from "../mutations/updateLabel"
import deleteLabel from "../mutations/deleteLabel"
import { useMutation } from "@blitzjs/rpc"
import { AddLabelForm } from "./AddLabelForm"
import { LabelIdsFormSchema } from "../schemas"
import updateTaskLabel from "src/tasks/mutations/updateTaskLabel"
import { labelTableColumns } from "./LabelTable"
import TaskTableModal from "./LabelAddTableModal"

export type TaskLabelInformation = {
  name: string
  description?: string
  labels?: []
  id: number
  selectedIds: number[]
  onChangeCallback?: () => void
  onMultipledAdded?: (selectedId) => void
}

const AddLabelsColumn = ({ row }) => {
  const [updateTaskLabelMutation] = useMutation(updateTaskLabel)
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
      const updated = await updateTaskLabelMutation({
        ...values,
        tasksId: [row.id],
        disconnect: true,
      })
      if (onChangeCallback != undefined) {
        onChangeCallback()
      }
      await toast.promise(Promise.resolve(updated), {
        loading: "Adding Roles to tasks...",
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
      <button
        type="button"
        /* button for popups */
        className="btn btn-primary"
        onClick={handleToggleEditLabelModal}
      >
        Add Role
      </button>
      <Modal open={openEditLabelModal} size="w-7/8 max-w-xl">
        <div className="">
          <h1 className="flex justify-center mb-2 text-3xl">Add Roles</h1>
          <div className="flex justify-start mt-4">
            <AddLabelForm
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

const LabelsColunm = ({ row }) => {
  const labels = row.labels || []
  return (
    <div className="modal-action flex justify-center mt-4">
      {
        <ul className="list-none">
          {labels.map((label) => (
            <li key={label.id}> {label.name}</li>
          ))}
        </ul>
      }
    </div>
  )
}

export const MultipleCheckboxColumn = ({ row }) => {
  const handleOnChange = (id) => {
    if (row.onMultipledAdded != undefined) {
      row.onMultipledAdded(id)
    }
  }

  return (
    <div>
      <span>
        {
          <div>
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={row.selectedIds.includes(row.id)}
                onChange={() => {
                  handleOnChange(row.id)
                }}
              />
            </label>
          </div>
        }
      </span>
    </div>
  )
}

const columnHelper = createColumnHelper<TaskLabelInformation>()

// ColumnDefs
export const labelTaskTableColumns = [
  columnHelper.accessor("name", {
    id: "name",
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Name",
  }),

  columnHelper.accessor("description", {
    id: "description",
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Description",
  }),
  columnHelper.accessor("labels", {
    id: "labels",
    cell: (info) => <LabelsColunm row={info.row.original}></LabelsColunm>,
    header: "Roles",
  }),

  columnHelper.accessor("id", {
    id: "open",
    header: "Add Role",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <AddLabelsColumn row={info.row.original}></AddLabelsColumn>,
    // cell: (info) => (
    //   <TaskTableModal
    //     buttonName={"Add Role"}
    //     labels={info.row.original.labels}
    //     tasksId={[info.row.original.id]}
    //     onChangeCallback={info.row.original.onChangeCallback || null}
    //   ></TaskTableModal>
    // ),
  }),

  columnHelper.accessor("id", {
    id: "multiple",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <MultipleCheckboxColumn row={info.row.original}></MultipleCheckboxColumn>,
    header: "Add Multiple",
  }),

  // columnHelper.accessor("id", {
  //   id: "multiple",
  //   enableColumnFilter: false,
  //   enableSorting: false,
  //   cell: (info) => (
  //     <span>
  //       {
  //         <div>
  //           <label className="label cursor-pointer">
  //             <input
  //               type="checkbox"
  //               className="checkbox checkbox-primary"
  //               checked={false}
  //               onChange={() => {
  //                 // console.log("Add multiple")
  //                 // handleOnChange(info.row.original)
  //               }}
  //             />
  //           </label>
  //         </div>
  //       }
  //     </span>
  //   ),
  //   header: "Add Multiple",
  // }),
]
