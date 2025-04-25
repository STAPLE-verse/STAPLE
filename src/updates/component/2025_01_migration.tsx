import React from "react"
import { invoke } from "@blitzjs/rpc"
import { toast } from "react-hot-toast"
import createDefaultFormsForUsers from "../queries/20250101_01_defaultform"
import linkDefaultFormToProjects from "../queries/20250101_02_linkdefaultform"
import migrateColumnsToMetadata from "../queries/20250101_03_createmetadata"

export const TriggerDefaultForms = () => {
  const handleCreateDefaultForms = async () => {
    try {
      // Call the backend function
      await invoke(createDefaultFormsForUsers, {})
      toast.success("Default forms created successfully for all users!")
    } catch (error) {
      console.error("Error creating default forms:", error)
      toast.error("Failed to create default forms. Check console for details.")
    }
  }

  return (
    <div className="flex flex-col items-center mt-2">
      <button onClick={handleCreateDefaultForms} className="btn btn-primary">
        Create Default Forms for Users
      </button>
    </div>
  )
}

export const LinkDefaultForms = () => {
  const handleLinkDefaultForms = async () => {
    try {
      // Call the backend function
      await invoke(linkDefaultFormToProjects, {})
      toast.success("Default forms linked to all users!")
    } catch (error) {
      console.error("Error linking default forms:", error)
      toast.error("Failed to link default forms. Check console for details.")
    }
  }

  return (
    <div className="flex flex-col items-center mt-2">
      <button onClick={handleLinkDefaultForms} className="btn btn-primary">
        Link Default Forms for Users
      </button>
    </div>
  )
}

export const CreateMetadata = () => {
  const handleCreateMetadata = async () => {
    try {
      // Call the backend function
      await invoke(migrateColumnsToMetadata, {})
      toast.success("Migrated metadata for all projects!")
    } catch (error) {
      console.error("Error migrating data:", error)
      toast.error("Failed to migrate data. Check console for details.")
    }
  }

  return (
    <div className="flex flex-col items-center mt-2">
      <button onClick={handleCreateMetadata} className="btn btn-primary">
        Create Metadata from Current Projects
      </button>
    </div>
  )
}
