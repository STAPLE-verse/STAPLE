import { useMemo, useState } from "react"
import { useMutation } from "@blitzjs/rpc"
import toast from "react-hot-toast"
import deleteFormVersion from "src/forms/mutations/deleteFormVersion"
import updateFormVersionArchive from "src/forms/mutations/updateFormVersionArchive"
import { FormVersionWithRelations } from "src/forms/queries/getForm"
import { ArchiveBoxIcon, ArrowUturnLeftIcon, TrashIcon } from "@heroicons/react/24/outline"

type Props = {
  versions: FormVersionWithRelations[]
  currentVersionId?: number
  onDeleted?: () => Promise<void> | void
}

export default function FormDeployments({ versions, currentVersionId, onDeleted }: Props) {
  const [deleteFormVersionMutation] = useMutation(deleteFormVersion)
  const [updateFormVersionArchiveMutation] = useMutation(updateFormVersionArchive)
  const [showArchived, setShowArchived] = useState(false)

  const visibleVersions = useMemo(
    () => versions.filter((version) => showArchived || !version.archived),
    [versions, showArchived]
  )

  const handleDelete = async (versionId: number, isInUse: boolean) => {
    const confirmed = window.confirm(
      isInUse
        ? "This version is still in use. Deleting it will archive the version instead. Continue?"
        : "This form version will be permanently deleted. Are you sure to continue?"
    )

    if (!confirmed) return

    try {
      await toast.promise(deleteFormVersionMutation({ id: versionId }), {
        loading: isInUse ? "Archiving version..." : "Deleting version...",
        success: (result) =>
          result?.action === "archived" ? "Form version archived." : "Form version deleted.",
        error: (error) =>
          error instanceof Error ? error.message : "Failed to delete form version.",
      })
      await onDeleted?.()
    } catch (error) {
      console.error("Failed to delete form version:", error)
    }
  }

  const handleArchiveToggle = async (versionId: number, archived: boolean) => {
    try {
      await toast.promise(updateFormVersionArchiveMutation({ id: versionId, archived }), {
        loading: archived ? "Unarchiving version..." : "Archiving version...",
        success: archived ? "Version unarchived." : "Version archived.",
        error: (error) =>
          error instanceof Error ? error.message : "Failed to update version archive state.",
      })
      await onDeleted?.()
    } catch (error) {
      console.error("Failed to update form version archive state:", error)
    }
  }

  if (versions.length === 0) {
    return <p className="text-md italic text-base-content/80">No form versions found.</p>
  }

  return (
    <div className="space-y-3">
      <label className="label cursor-pointer justify-end gap-2">
        <span className="label-text">Show archived</span>
        <input
          type="checkbox"
          className="toggle toggle-sm"
          checked={showArchived}
          onChange={(e) => setShowArchived(e.target.checked)}
        />
      </label>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="text-xl text-base-content">
            <tr>
              <th>Version</th>
              <th>Name</th>
              <th>Status</th>
              <th>Tasks</th>
              <th>Projects</th>
              <th>Usage</th>
              <th>Archive</th>
              <th />
            </tr>
          </thead>
          <tbody className="text-lg">
            {visibleVersions.map((version) => {
              const isCurrent =
                typeof currentVersionId === "number" && version.id === currentVersionId
              const usageCount = version.tasks.length + version.projects.length
              const isInUse = usageCount > 0
              const isArchived = !!version.archived

              return (
                <tr key={version.id} className={isArchived ? "opacity-70" : ""}>
                  <td>v{version.version}</td>
                  <td>{version.name}</td>
                  <td>
                    {isArchived ? (
                      <span className="badge badge-warning badge-sm">Archived</span>
                    ) : (
                      <span className="badge badge-success badge-sm">Active</span>
                    )}
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {version.tasks.length > 0 ? (
                        version.tasks.map((task) => (
                          <span key={task.id} className="badge badge-secondary badge-sm">
                            {task.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-base-content/40">—</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {version.projects.length > 0 ? (
                        version.projects.map((project) => (
                          <span key={project.id} className="badge badge-primary badge-sm">
                            {project.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-base-content/40">—</span>
                      )}
                    </div>
                  </td>
                  <td>
                    {isCurrent
                      ? "—"
                      : isInUse
                      ? `${usageCount} deployment${usageCount === 1 ? "" : "s"}`
                      : "Unused"}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => void handleArchiveToggle(version.id, !isArchived)}
                      title={isArchived ? "Unarchive version" : "Archive version"}
                    >
                      {isArchived ? (
                        <ArrowUturnLeftIcon className="w-4 h-4" />
                      ) : (
                        <ArchiveBoxIcon className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                  <td className="text-right">
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm text-error"
                      onClick={() => void handleDelete(version.id, isInUse)}
                      title={
                        isInUse
                          ? "Deleting will archive this version because it is still in use"
                          : "Delete version"
                      }
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {visibleVersions.length === 0 && (
        <p className="text-md italic text-base-content/80">No visible versions found.</p>
      )}
    </div>
  )
}
