import React from "react"
import { invoke } from "@blitzjs/rpc"
import { toast } from "react-hot-toast"
import migrateNewDashboardWidgets from "../queries/20250319_01_dashboardwidgets"

export const TriggerDashboardMigration = () => {
  const handleRunMigration = async () => {
    try {
      // Call the backend function
      await invoke(migrateNewDashboardWidgets, {})
      toast.success("Migration completed successfully! All users now have updated widgets.")
    } catch (error) {
      console.error("Error running migration:", error)
      toast.error("Migration failed. Check console for details.")
    }
  }

  return (
    <div className="flex flex-col items-center mt-2">
      <button onClick={handleRunMigration} className="btn btn-primary">
        Add New Dashboard Widgets
      </button>
    </div>
  )
}
