import { useMutation } from "@blitzjs/rpc"
import { AssignmentStatus } from "db"
import { useEffect, useState } from "react"
import updateAssignment from "src/assignments/mutations/updateAssignment"

const CompleteToggle = ({ currentAssignment, refetch, completedLabel, completedBy }) => {
  const [updateAssignmentMutation] = useMutation(updateAssignment)

  // Handle assignment status
  const handleAssignmentStatusToggle = async () => {
    const newStatus =
      currentAssignment?.status === AssignmentStatus.COMPLETED
        ? AssignmentStatus.NOT_COMPLETED
        : AssignmentStatus.COMPLETED

    await updateAssignmentMutation({
      id: currentAssignment!.id,
      status: newStatus,
      completedBy: newStatus ? completedBy : null,
    })

    await refetch()
  }

  const [isChecked, setIsChecked] = useState(
    currentAssignment!.status === AssignmentStatus.COMPLETED
  )

  useEffect(() => {
    // Update the local state when the assignment status changes in the database
    setIsChecked(currentAssignment!.status === AssignmentStatus.COMPLETED || false)
  }, [currentAssignment])

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
