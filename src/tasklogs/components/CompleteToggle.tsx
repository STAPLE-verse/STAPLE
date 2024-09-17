import { useMutation } from "@blitzjs/rpc"
import { AssignmentStatus, CompletedAs } from "db"
import { useState } from "react"
import updateAssignment from "src/assignments/mutations/updateAssignment"
import { useTaskContext } from "src/tasks/components/TaskContext"

const CompleteToggle = ({
  currentAssignment,
  // refetch,
  completedRole,
  completedBy,
  completedAs,
}) => {
  const [updateAssignmentMutation] = useMutation(updateAssignment)
  // Get refecth from taskContext
  const { refetchTaskData } = useTaskContext()
  // Handle assignment status
  const handleAssignmentStatusToggle = async () => {
    const newChecked = isChecked ? false : true
    const newStatus = newChecked ? AssignmentStatus.COMPLETED : AssignmentStatus.NOT_COMPLETED

    await updateAssignmentMutation({
      id: currentAssignment.id,
      status: newStatus,
      completedBy: completedBy,
      completedAs: completedAs as CompletedAs,
    })

    setIsChecked(newChecked)
    // await refetch()
    await refetchTaskData()
  }

  const latestStatusLog = currentAssignment.statusLogs.reduce((latest, current) => {
    return latest.createdAt > current.createdAt ? latest : current
  }, currentAssignment.statusLogs[0])

  const [isChecked, setIsChecked] = useState(latestStatusLog.status === AssignmentStatus.COMPLETED)

  // Get team name if assignment is completed as a team
  const teamName = completedAs === CompletedAs.TEAM ? currentAssignment.team.name : undefined

  return (
    <div>
      {currentAssignment ? (
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
