import { useMutation } from "@blitzjs/rpc"
import { AssignmentStatus } from "db"
import { CompletedAs as CompletedAsType } from "db"
import { useState } from "react"
import updateAssignment from "src/assignments/mutations/updateAssignment"
import Modal from "src/core/components/Modal"
import JsonForm from "./JsonForm"
import getJsonSchema from "src/services/jsonconverter/getJsonSchema"

const CompleteSchema = ({ currentAssignment, refetch, completedBy, completedAs, schema, ui }) => {
  // Setup
  const [updateAssignmentMutation] = useMutation(updateAssignment)
  // Get the latest assignmentStatus
  const assignmentStatus = currentAssignment.statusLogs[0]
  // State to store metadata
  const [assignmentMetadata, setAssignmentMetadata] = useState(assignmentStatus!.metadata)

  // Handle metadata form open toggle
  const [openAssignmentModal, setOpenAssignmentModal] = useState(false)
  const handleToggle = () => {
    setOpenAssignmentModal((prev) => !prev)
  }

  // Handle assignment metadata
  const handleJsonFormSubmit = async (data) => {
    await updateAssignmentMutation({
      id: currentAssignment!.id,
      status: AssignmentStatus.COMPLETED,
      completedBy: completedBy,
      completedAs: completedAs as CompletedAsType,
      metadata: data.formData,
    })
    // console.log(data.formData)
    setAssignmentMetadata(data.formData)

    await refetch()
  }

  const handleJsonFormError = (errors) => {
    console.log(errors)
  }

  return (
    <div>
      {currentAssignment ? (
        <div>
          <button className="btn btn-primary" onClick={() => handleToggle()}>
            {/* TODO: rewrite */}
            {completedAs === CompletedAsType.TEAM &&
              assignmentStatus.status === AssignmentStatus.COMPLETED &&
              `Update ${currentAssignment.team.name} Data`}
            {completedAs === CompletedAsType.TEAM &&
              assignmentStatus.status === AssignmentStatus.NOT_COMPLETED &&
              `Provide ${currentAssignment.team.name} Data`}
            {completedAs === CompletedAsType.INDIVIDUAL &&
              assignmentStatus.status === AssignmentStatus.COMPLETED &&
              `Update Individual Data`}
            {completedAs === CompletedAsType.INDIVIDUAL &&
              assignmentStatus.status === AssignmentStatus.NOT_COMPLETED &&
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
