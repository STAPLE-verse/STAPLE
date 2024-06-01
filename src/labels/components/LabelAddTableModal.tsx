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
import { LabelIdsFormSchema } from "../schemas"
import updateTaskLabel from "src/tasks/mutations/updateTaskLabel"

const TaskTableModal = ({ labels, tasksId, onChangeCallback, buttonName }) => {
  const [updateTaskLabelMutation] = useMutation(updateTaskLabel)

  const [openEditLabelModal, setOpenEditLabelModal] = useState(false)
  const handleToggleEditLabelModal = () => {
    setOpenEditLabelModal((prev) => !prev)
  }
  const labelsId = labels.map((label) => label.id)
  const initialValues = {
    labelsId: labelsId,
  }

  const handleAddLabel = async (values) => {
    try {
      const updated = await updateTaskLabelMutation({
        ...values,
        tasksId: tasksId,
        disconnect: true,
      })
      if (onChangeCallback != undefined) {
        onChangeCallback()
      }
      await toast.promise(Promise.resolve(updated), {
        loading: "Adding labels to tasks...",
        success: "Labels added!",
        error: "Failed to add the labels...",
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
        className="btn btn-primary"
        onClick={handleToggleEditLabelModal}
      >
        {buttonName}
      </button>
      <Modal open={openEditLabelModal} size="w-7/8 max-w-xl">
        <div className="">
          <h1 className="flex justify-center mb-2 text-3xl">Add Labels</h1>
          <div className="flex justify-start mt-4">
            <AddLabelForm
              schema={LabelIdsFormSchema}
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

export default TaskTableModal
