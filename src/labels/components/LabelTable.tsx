import React, { useState } from "react"
import { createColumnHelper } from "@tanstack/react-table"
import Modal from "src/core/components/Modal"
import { FORM_ERROR, LabelForm } from "./LabelForm"
import toast from "react-hot-toast"
import updateLabel from "../mutations/updateLabel"
import deleteLabel from "../mutations/deleteLabel"
import { useMutation } from "@blitzjs/rpc"
import { strict } from "assert"
import { LabelFormSchema } from "../schemas"

export type LabelInformation = {
  name: string
  description?: string
  taxonomy?: string
  id: number
  userId: number
  onChangeCallback?: () => void
  taxonomyList: string[]
}

const EditColunm = ({ row }) => {
  const [updateLabelMutation] = useMutation(updateLabel)
  const {
    name = "",
    description = "",
    taxonomy = "",
    userId = null,
    id = null,
    onChangeCallback = null,
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
  const taxonomyList = row.taxonomyList

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
              taxonomyList={taxonomyList}
              // name={""}
              // description={""}
              // taxonomy={""}
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

const DeleteColunm = ({ row }) => {
  const [deleteLabelMutation] = useMutation(deleteLabel)
  const { id = null, onChangeCallback = null, ...rest } = { ...row }

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
    cell: (info) => <EditColunm row={info.row.original}></EditColunm>,
  }),

  columnHelper.accessor("id", {
    id: "delete",
    header: "",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <DeleteColunm row={info.row.original}></DeleteColunm>,
  }),
]
