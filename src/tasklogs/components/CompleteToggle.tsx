import { useMutation } from "@blitzjs/rpc"
import { Status, CompletedAs } from "db"
import { useState } from "react"
import { useTaskContext } from "src/tasks/components/TaskContext"
import updateTaskLog from "../mutations/updateTaskLog"

const CompleteToggle = ({
  taskLog,
  completedById,
  completedAs,
  refetchTaskData: propRefetchTaskData,
}) => {
  const [updateTaskLogMutation] = useMutation(updateTaskLog)

  let contextRefetchTaskData: (() => Promise<void>) | undefined
  try {
    const context = useTaskContext()
    contextRefetchTaskData = async () => {
      await context.refetchTaskData()
    }
  } catch (error) {
    // context not available
  }

  // Handle assignment status
  const handleAssignmentStatusToggle = async () => {
    const newChecked = isChecked ? false : true
    const newStatus = newChecked ? Status.COMPLETED : Status.NOT_COMPLETED

    await updateTaskLogMutation({
      id: taskLog.id,
      status: newStatus,
      completedById: completedById,
      completedAs: completedAs as CompletedAs,
    })

    setIsChecked(newChecked)
    await (contextRefetchTaskData?.() ?? propRefetchTaskData?.())
  }

  const [isChecked, setIsChecked] = useState(taskLog.status === Status.COMPLETED)

  // Get team name if taskLog is completed as a team
  const teamName =
    completedAs === CompletedAs.TEAM && taskLog.assignedTo.name
      ? taskLog.assignedTo.name
      : undefined

  return (
    <div>
      {taskLog ? (
        <div className="flex items-center space-x-2">
          <span>Not Completed</span>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="toggle toggle-success"
              checked={isChecked}
              onChange={handleAssignmentStatusToggle}
            />
            <span className="ml-2">Completed</span>
          </label>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default CompleteToggle
