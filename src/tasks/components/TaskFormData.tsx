// @ts-nocheck

import { useContext, useState } from "react"
import { Tooltip } from "react-tooltip"
import JsonForm from "src/assignments/components/JsonForm"
import Modal from "src/core/components/Modal"
import getJsonSchema from "src/services/jsonconverter/getJsonSchema"
import { TaskContext } from "./TaskContext"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { useParam } from "@blitzjs/next"

export const TaskFormData = () => {
  const [openMetadataInspectModal, setOpenMetadataInspectModal] = useState(false)

  const taskContext = useContext(TaskContext)

  if (!taskContext || !taskContext.task) {
    return <div>Loading...</div>
  }

  const { task } = taskContext

  const handleMetadataInspectToggle = () => {
    setOpenMetadataInspectModal((prev) => !prev)
  }

  const taskId = useParam("taskId", "number")
  const projectId = useParam("projectId", "number")

  const uiSchema = task["ui"] || {}
  let extendedUiSchema = {}
  // TODO: This assumes uiSchema is always an object, although the type def allows for string, number(?) as well
  // I am not sure where would we encounter those
  if (uiSchema && typeof uiSchema === "object" && !Array.isArray(uiSchema)) {
    // We do not want to show the submit button
    extendedUiSchema = {
      ...uiSchema,
      "ui:submitButtonOptions": {
        norender: true,
      },
    }
  }

  return (
    <div className="stat place-items-center">
      <div className="stat-title text-2xl text-inherit" data-tooltip-id="form-tool">
        Form Data
      </div>
      <Tooltip
        id="form-tool"
        content="Review the form requirements for this task"
        className="z-[1099]"
      />
      <div>
        {task["schema"] ? (
          <div className="flex-row w-full justify-center">
            <center>
              <button className="btn btn-primary" onClick={() => handleMetadataInspectToggle()}>
                Required Form
              </button>
            </center>
            <Modal open={openMetadataInspectModal} size="w-11/12 max-w-5xl">
              <div className="font-sans">
                {<JsonForm schema={getJsonSchema(task["schema"])} uiSchema={extendedUiSchema} />}
              </div>
              <div className="modal-action">
                <button className="btn btn-primary" onClick={handleMetadataInspectToggle}>
                  Close
                </button>
              </div>
            </Modal>
            <div className="flex-row w-full justify-center">
              <Link
                className="btn btn-info mt-2"
                href={Routes.ShowFormPage({
                  projectId: projectId,
                  taskId: taskId,
                })}
              >
                Download Form Data
              </Link>
            </div>
          </div>
        ) : (
          "No Form Data Required"
        )}
      </div>
    </div>
  )
}
