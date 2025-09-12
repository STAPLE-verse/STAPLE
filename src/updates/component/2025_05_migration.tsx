import React from "react"
import { invoke } from "@blitzjs/rpc"
import { toast } from "react-hot-toast"
import migrateElementsToMilestones from "../queries/20250529_01_milestonestoelements"

export const TriggerMilestoneMutation = () => {
  const handleRunMigration = async () => {
    try {
      // Call the backend function
      await invoke(migrateElementsToMilestones, {})
      toast.success("Migration completed successfully! All users now have updated widgets.")
    } catch (error) {
      console.error("Error running migration:", error)
      toast.error("Migration failed. Check console for details.")
    }
  }

  return (
    <div className="flex flex-col items-center mt-2">
      <button onClick={handleRunMigration} className="btn btn-primary">
        Move Elements to Milestones
      </button>
    </div>
  )
}
