import React, { useState } from "react"
import { Task } from "db"

import { RowSelection, createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import Modal from "src/core/components/Modal"
import { FORM_ERROR, LabelForm } from "./LabelForm"
import { LabelFormSchema } from "src/labels/schemas"
import toast from "react-hot-toast"
import updateLabel from "../mutations/updateLabel"
import deleteLabel from "../mutations/deleteLabel"
import { useMutation } from "@blitzjs/rpc"

export type LabelInformation = {
  name: string
  description?: string
  taxonomy?: string
  id: number
  userId: number
  onChangeCallback?: () => void
}

const EditColumn = ({ row }) => {
  const [updateLabelMutation] = useMutation(updateLabel)
  const {
    name = "",
    description = "",
    taxonomy = "",
    userId = null,
    id = null,
    onChangeCallback = undefined,
    ...rest
  } = { ...row }

  const [openEditLabelModal, setOpenEditLabelModal] = useState(false)
  const handleToggleEditLabelModal = () => {
    setOpenEditLabelModal((prev) => !prev)
  }

  const initialValues = {
    name: name,
    description: description,
    taxonomy: taxonomy,
  }

  const handleEditLabel = async (values) => {
    // console.log(values)
    try {
      const updated = await updateLabelMutation({
        ...values,
        userId: userId,
        id: id,
      })
      if (onChangeCallback != undefined) {
        onChangeCallback()
      }
      await toast.promise(Promise.resolve(updated), {
        loading: "Editing label...",
        success: "Label edited!",
        error: "Failed to edit the label...",
      })
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
        Edit
      </button>
      <Modal open={openEditLabelModal} size="w-7/8 max-w-xl">
        <div className="">
          <h1 className="flex justify-center mb-2">Editing label</h1>
          <div className="flex justify-start mt-4">
            <LabelForm
              schema={LabelFormSchema}
              submitText="Update Label"
              className="flex flex-col"
              onSubmit={handleEditLabel}
              initialValues={initialValues}
              name={""}
              description={""}
              taxonomy={""}
            ></LabelForm>
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

const DeleteColumn = ({ row }) => {
  const [deleteLabelMutation] = useMutation(deleteLabel)
  const { id = null, onChangeCallback = undefined, ...rest } = { ...row }

  const handleDeleteLabel = async (values) => {
    // console.log(values)
    try {
      const updated = await deleteLabelMutation({
        id: id,
      })
      if (onChangeCallback != undefined) {
        onChangeCallback()
      }
      await toast.promise(Promise.resolve(updated), {
        loading: "Deleting label...",
        success: "Label deleted!",
        error: "Failed to edit the label...",
      })
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
        onClick={handleDeleteLabel}
      >
        Delete
      </button>
    </div>
  )
}

const columnHelper = createColumnHelper<LabelInformation>()

// ColumnDefs
export const lableTableColumns = [
  columnHelper.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Label Name",
  }),

  columnHelper.accessor("description", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Description",
  }),
  columnHelper.accessor("taxonomy", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Taxonomy",
  }),

  columnHelper.accessor("id", {
    id: "edit",
    header: "",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <EditColumn row={info.row.original}></EditColumn>,
  }),

  columnHelper.accessor("id", {
    id: "delete",
    header: "",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <DeleteColumn row={info.row.original}></DeleteColumn>,
  }),
]
