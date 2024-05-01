import React, { useState } from "react"
import { Task } from "db"

import { RowSelection, createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import Modal from "src/core/components/Modal"
import { FORM_ERROR, LabelForm } from "./LabelForm"

import toast from "react-hot-toast"
import updateLabel from "../mutations/updateLabel"
import deleteLabel from "../mutations/deleteLabel"
import { useMutation } from "@blitzjs/rpc"
import { AddLabelForm } from "./AddLabelForm"
import { LabelTaskFormSchema } from "../schemas"
import updateTaskLabel from "src/tasks/mutations/updateTaskLabel"

export type TaskLabelInformation = {
  name: string
  description?: string
  labels?: []
  id: number
  onChangeCallback?: () => void
}

const AddLabelsColunm = ({ row }) => {
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

  const initialValues = {
    // name: name,
    // description: description,
    // taxonomy: taxonomy,
    taskId: id,
  }

  const handleAddLabel = async (values) => {
    console.log(values)
    try {
      const updated = await updateTaskLabelMutation({
        ...values,
        // userId: userId,
        // id: id,
      })
      // if (onChangeCallback != undefined) {
      //   onChangeCallback()
      // }
      // await toast.promise(Promise.resolve(updated), {
      //   loading: "Editing label...",
      //   success: "Label edited!",
      //   error: "Failed to edit the label...",
      // })
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  return (
    <div className="modal-action flex justify-end mt-4">
      <button
        type="button"
        /* button for popups */
        className="btn btn-outline btn-primary"
        onClick={handleToggleEditLabelModal}
      >
        Add label
      </button>
      <Modal open={openEditLabelModal} size="w-7/8 max-w-xl">
        <div className="">
          <h1 className="flex justify-center mb-2">Add labels</h1>
          <div className="flex justify-start mt-4">
            <AddLabelForm
              schema={LabelTaskFormSchema}
              submitText="Update Label"
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
              className="btn btn-outline btn-primary"
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
  console.log(row)
  const labels = row.labels || []

  return (
    <div className="modal-action flex justify-end mt-4">
      {
        <ul className="menu menu-horizontal menu-lg">
          {labels.map((label) => (
            <li key={label.id}>{label.name}</li>
          ))}
        </ul>
      }
    </div>
  )
}

const columnHelper = createColumnHelper<TaskLabelInformation>()

// ColumnDefs
export const labelTaskTableColumns = [
  columnHelper.accessor("name", {
    id: "name",
    cell: (info) => (
      <span>
        {info.getValue()} :{info.row.original.id}
      </span>
    ),
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
    header: "Labels",
  }),

  columnHelper.accessor("id", {
    id: "open",
    header: "",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <AddLabelsColunm row={info.row.original}></AddLabelsColunm>,
  }),

  columnHelper.accessor("id", {
    id: "multiple",
    cell: (info) => (
      <span>
        {
          <div>
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={false}
                onChange={() => {
                  console.log("Add multiple")
                  // handleOnChange(info.row.original)
                }}
              />
            </label>
          </div>
        }
      </span>
    ),
    header: "Add Multiple",
  }),
]
