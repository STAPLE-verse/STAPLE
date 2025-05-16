import { useMutation } from "@blitzjs/rpc"
import { Status } from "db"
import { CompletedAs as CompletedAsType } from "db"
import { useState } from "react"
import { useTaskContext } from "src/tasks/components/TaskContext"
import updateTaskLog from "../mutations/updateTaskLog"
import getJsonSchema from "src/forms/utils/getJsonSchema"
import { JsonFormModal } from "src/core/components/JsonFormModal"

const CompleteSchema = ({ taskLog, completedById, completedAs, schema, ui }) => {
  // Setup
  const [updateTaskLogMutation] = useMutation(updateTaskLog)
  // State to store metadata
  const [assignmentMetadata, setAssignmentMetadata] = useState(taskLog.metadata)
  // Get refecth from taskContext
  const { refetchTaskData } = useTaskContext()

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

    // TODO: Add handler to close modal

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

    // TODO: Add handler to close modal

    // Refetch the data
    await refetchTaskData()
  }

  return (
    <div>
      {taskLog ? (
        <JsonFormModal
          schema={getJsonSchema(schema)}
          uiSchema={ui}
          metadata={assignmentMetadata}
          label="Edit Response"
          classNames="btn-info btn w-2/3"
          onSubmit={handleJsonFormSubmit}
          onError={handleJsonFormError}
          resetHandler={handleResetMetadata}
          modalSize="w-11/12 max-w-5xl"
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default CompleteSchema
