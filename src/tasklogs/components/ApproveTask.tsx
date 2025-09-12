import { useState, useEffect } from "react"
import updateApproval from "../mutations/updateApproval"
import { useMutation } from "@blitzjs/rpc"
import { useCurrentContributor } from "src/contributors/hooks/useCurrentContributor"
import { useParam } from "@blitzjs/next"
import { toast } from "react-hot-toast" // Import the toast

export const ApproveDropdown = ({ value, taskLogId, onChange }) => {
  const [updateApprovalMutation] = useMutation(updateApproval)
  const [selectedApproval, setSelectedApproval] = useState(value ?? null) // Use null as the default value
  const projectId = useParam("projectId", "number")
  const { projectMember: currentContributor } = useCurrentContributor(projectId)

  useEffect(() => {
    setSelectedApproval(value ?? null) // Ensure state is updated if the value changes
  }, [value])

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value
    const newValue = selectedValue === "true" ? true : selectedValue === "false" ? false : null
    setSelectedApproval(newValue) // Update local state for the dropdown
    onChange(newValue) // Update the parent component or local state as needed

    // Call the mutation to update approval status
    await updateApprovalMutation({
      id: taskLogId,
      completedById: currentContributor!.id,
      approved: newValue,
    })

    // Show a toast notification based on the approval status
    if (newValue === true) {
      toast.success("Task approved successfully!")
    } else if (newValue === false) {
      toast.error("Task was set to not approved.")
    } else {
      toast.success("Task approval status pending.")
    }
  }

  return (
    <div className="flex justify-center w-full">
      <select
        value={selectedApproval === null ? "" : selectedApproval} // The value of the dropdown is set to the local state, handle null as ""
        onChange={handleChange}
        className="border w-full rounded p-1 font-semibold border-2 border-primary focus:outline-primary focus:ring-2 focus:ring-secondary"
        style={{
          fontSize: "1rem",
          padding: "0.25rem 0.75rem",
          borderRadius: "3px",
          appearance: "none",
          marginTop: "0.5rem",
        }}
      >
        <option value="true">✅ Yes</option>
        <option value="false">❌ No</option>
        <option value="">⚠️ Pending</option> {/* Empty value for null */}
      </select>
    </div>
  )
}
