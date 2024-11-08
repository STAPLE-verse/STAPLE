import { useMutation } from "@blitzjs/rpc"
import { Status } from "db"
import { CompletedAs as CompletedAsType } from "db"
import { useState } from "react"
import Modal from "src/core/components/Modal"
import JsonForm from "../../core/components/JsonForm"
import getJsonSchema from "src/services/jsonconverter/getJsonSchema"
import { useTaskContext } from "src/tasks/components/TaskContext"
import updateTaskLog from "../mutations/updateTaskLog"

const CompleteSchema = ({ taskLog, completedById, completedAs, schema, ui }) => {
  // Setup
  const [updateTaskLogMutation] = useMutation(updateTaskLog)
  // State to store metadata
  const [assignmentMetadata, setAssignmentMetadata] = useState(taskLog.metadata)
  // Get refecth from taskContext
  const { refetchTaskData } = useTaskContext()

  // Handle metadata form open toggle
  const [openAssignmentModal, setOpenAssignmentModal] = useState(false)
  const handleToggle = () => {
    setOpenAssignmentModal((prev) => !prev)
  }

  // Handle assignment metadata
  const handleJsonFormSubmit = async (data) => {
    await updateTaskLogMutation({
      id: taskLog.id,
      status: Status.COMPLETED,
      completedById: completedById,
      completedAs: completedAs as CompletedAsType,
      metadata: data.formData,
    })

    setAssignmentMetadata(data.formData)

    // Close modal
    setOpenAssignmentModal(false)

    await refetchTaskData()
  }

  const handleJsonFormError = (errors) => {
    console.log(errors)
  }

  // Handle reset metadata
  // Using hard reset to bypass validation
  const handleResetMetadata = async () => {
    await updateTaskLogMutation({
      id: taskLog.id,
      status: Status.NOT_COMPLETED,
      completedById: completedById,
      completedAs: completedAs as CompletedAsType,
      metadata: {}, // Reset metadata to an empty object
    })

    setAssignmentMetadata({})

    // Close modal
    setOpenAssignmentModal(false)

    // Refetch the data
    await refetchTaskData()
  }

  return (
    <div>
      {taskLog ? (
        <div>
          <button className="btn btn-primary" onClick={() => handleToggle()}>
            {/* TODO: rewrite */}
            {completedAs === CompletedAsType.TEAM &&
              taskLog.status === Status.COMPLETED &&
              `Update ${taskLog.assignedTo.name} Data`}
            {completedAs === CompletedAsType.TEAM &&
              taskLog.status === Status.NOT_COMPLETED &&
              `Provide ${taskLog.assignedTo.name} Data`}
            {completedAs === CompletedAsType.INDIVIDUAL &&
              taskLog.status === Status.COMPLETED &&
              `Update Individual Data`}
            {completedAs === CompletedAsType.INDIVIDUAL &&
              taskLog.status === Status.NOT_COMPLETED &&
              `Provide Individual Data`}
          </button>
          <Modal open={openAssignmentModal} size="w-11/12 max-w-5xl">
            <div className="font-sans">
              {
                <JsonForm
                  formData={assignmentMetadata}
                  onSubmit={handleJsonFormSubmit}
                  schema={getJsonSchema(schema)}
                  onError={handleJsonFormError}
                  uiSchema={ui}
                />
              }
            </div>
            <div className="modal-action">
              <button className="btn btn-primary" onClick={handleToggle}>
                Close
              </button>
              <button className="btn btn-secondary ml-2" onClick={handleResetMetadata}>
                Reset Form Data
              </button>
            </div>
          </Modal>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default CompleteSchema
