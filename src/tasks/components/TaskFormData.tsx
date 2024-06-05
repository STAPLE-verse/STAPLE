import { useState } from "react"
import { Tooltip } from "react-tooltip"
import JsonForm from "src/assignments/components/JsonForm"
import Modal from "src/core/components/Modal"
import getJsonSchema from "src/services/jsonconverter/getJsonSchema"

export const TaskFormData = ({ task }) => {
  const [openMetadataInspectModal, setOpenMetadataInspectModal] = useState(false)

  const handleMetadataInspectToggle = () => {
    setOpenMetadataInspectModal((prev) => !prev)
  }

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
          <div>
            <button className="btn btn-primary" onClick={() => handleMetadataInspectToggle()}>
              Review
            </button>
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
          </div>
        ) : (
          "No Form Data Required"
        )}
      </div>
    </div>
  )
}
