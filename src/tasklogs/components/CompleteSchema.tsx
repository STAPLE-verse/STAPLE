import { toast } from "react-hot-toast"
import { useMutation } from "@blitzjs/rpc"
import { Status } from "db"
import { CompletedAs as CompletedAsType } from "db"
import { useState } from "react"
import { useTaskContext } from "src/tasks/components/TaskContext"
import updateTaskLog from "../mutations/updateTaskLog"
import getJsonSchema from "src/forms/utils/getJsonSchema"
import { JsonFormModal } from "src/core/components/JsonFormModal"

const CompleteSchema = ({
  taskLog,
  completedById,
  completedAs,
  schema,
  ui,
  refetchTaskData: propRefetchTaskData,
}: {
  taskLog: any
  completedById: number
  completedAs: CompletedAsType
  schema: any
  ui: any
  refetchTaskData?: () => Promise<void>
}) => {
  // Setup
  const [updateTaskLogMutation] = useMutation(updateTaskLog)
  // State to store metadata
  const [assignmentMetadata, setAssignmentMetadata] = useState(taskLog.metadata)
  // Get refecth from taskContext safely
  let contextRefetchTaskData: (() => Promise<void>) | undefined
  try {
    const context = useTaskContext()
    contextRefetchTaskData = async () => {
      await context.refetchTaskData()
    }
  } catch (e) {
    // context not available
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
    toast.success("Form submitted successfully!")

    // TODO: Add handler to close modal

    await (contextRefetchTaskData?.() ?? propRefetchTaskData?.())
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
    await (contextRefetchTaskData?.() ?? propRefetchTaskData?.())
  }

  return (
    <div>
      {taskLog ? (
        <JsonFormModal
          schema={getJsonSchema(schema)}
          uiSchema={ui}
          metadata={assignmentMetadata}
          label="Edit Response"
          classNames="btn-info btn w-full"
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
