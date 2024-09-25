import { useMutation } from "@blitzjs/rpc"
import { Status, CompletedAs } from "db"
import { useState } from "react"
import { useTaskContext } from "src/tasks/components/TaskContext"
import updateTaskLog from "../mutations/updateTaskLog"

const CompleteToggle = ({
  // refetch,
  taskLog,
  completedRole,
  completedById,
  completedAs,
}) => {
  const [updateTaskLogMutation] = useMutation(updateTaskLog)
  // Get refecth from taskContext
  const { refetchTaskData } = useTaskContext()

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
    // await refetch()
    await refetchTaskData()
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
          <span className="font-semibold">
            {completedAs == CompletedAs.INDIVIDUAL && "Individual: "}
            {completedAs == CompletedAs.TEAM && teamName && `${teamName}:`}
          </span>
          <span>Not Completed</span>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="toggle toggle-success"
              checked={isChecked}
              onChange={handleAssignmentStatusToggle}
            />
            <span className="ml-2">{completedRole}</span>
          </label>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default CompleteToggle
