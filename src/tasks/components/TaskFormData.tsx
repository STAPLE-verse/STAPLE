import { useState } from "react"
import { Tooltip } from "react-tooltip"
import JsonForm from "src/tasklogs/components/JsonForm"
import Modal from "src/core/components/Modal"
import getJsonSchema from "src/services/jsonconverter/getJsonSchema"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { useTaskContext } from "./TaskContext"

export const TaskFormData = () => {
  const [openMetadataInspectModal, setOpenMetadataInspectModal] = useState(false)

  const { task } = useTaskContext()

  const handleMetadataInspectToggle = () => {
    setOpenMetadataInspectModal((prev) => !prev)
  }

  const uiSchema = task.formVersion?.uiSchema || {}
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
        className="z-[1099] ourtooltips"
      />
      <div>
        {task.formVersion ? (
          <div className="flex flex-col items-center w-full">
            <div className="flex justify-center mb-4">
              <button className="btn btn-primary" onClick={() => handleMetadataInspectToggle()}>
                Preview Required Form
              </button>
            </div>
            <Modal open={openMetadataInspectModal} size="w-11/12 max-w-5xl">
              <div className="font-sans">
                {
                  <JsonForm
                    schema={getJsonSchema(task.formVersion.schema)}
                    uiSchema={extendedUiSchema}
                  />
                }
              </div>
              <div className="modal-action">
                <button className="btn btn-primary" onClick={handleMetadataInspectToggle}>
                  Close
                </button>
              </div>
            </Modal>
            <div className="flex justify-center mt-2">
              <Link
                className="btn btn-info mt-2"
                href={Routes.ShowMetadataPage({
                  projectId: task.projectId,
                  taskId: task.id,
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
