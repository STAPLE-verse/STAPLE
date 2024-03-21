import { useMutation } from "@blitzjs/rpc"
import { AssignmentStatus, CompletedAs, Assignment } from "db"
import { useEffect, useState } from "react"
import updateAssignment from "src/assignments/mutations/updateAssignment"

const CompleteToggle = ({
  currentAssignment,
  refetch,
  completedLabel,
  completedBy,
  completedAs,
}) => {
  const [updateAssignmentMutation] = useMutation(updateAssignment)

  // Handle assignment status
  const handleAssignmentStatusToggle = async () => {
    const newChecked = isChecked ? false : true
    const newStatus = newChecked ? AssignmentStatus.COMPLETED : AssignmentStatus.NOT_COMPLETED

    await updateAssignmentMutation({
      id: currentAssignment!.id,
      status: newStatus,
      completedBy: newChecked ? completedBy : null,
      completedAs: completedAs as CompletedAs,
    })

    setIsChecked(newChecked)
    await refetch()
  }

  const [isChecked, setIsChecked] = useState(
    currentAssignment!.status === AssignmentStatus.COMPLETED
  )

  return (
    <div>
      {currentAssignment ? (
        <div className="flex items-center space-x-2">
          <span>Not Completed</span>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="toggle"
              checked={isChecked}
              onChange={handleAssignmentStatusToggle}
            />
            <span className="ml-2">{completedLabel}</span>
          </label>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default CompleteToggle
