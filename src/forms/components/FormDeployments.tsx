import { useMemo, useState } from "react"
import { useMutation } from "@blitzjs/rpc"
import toast from "react-hot-toast"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
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
  const [showArchived, setShowArchived] = useState(true)

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
              <th>Archive</th>
              <th />
            </tr>
          </thead>
          <tbody className="text-lg">
            {visibleVersions.map((version) => {
              const isArchived = !!version.archived
              const isInUse = version.tasks.length > 0 || version.projects.length > 0

              const allProjects = [...version.projects, ...version.tasks.map((t) => t.project)]
              const uniqueProjects = Array.from(new Map(allProjects.map((p) => [p.id, p])).values())

              return (
                <tr key={version.id} className={isArchived ? "opacity-70" : ""}>
                  <td>v{version.version}</td>
                  <td>{version.name}</td>
                  <td className={isArchived ? "text-warning" : "text-success"}>
                    {isArchived ? "Archived" : "Active"}
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {version.tasks.length > 0 ? (
                        version.tasks.map((task) => (
                          <Link
                            key={task.id}
                            className="btn btn-xs btn-ghost border border-base-content/20"
                            href={Routes.ShowTaskPage({
                              projectId: task.project.id,
                              taskId: task.id,
                            })}
                          >
                            {task.name}
                          </Link>
                        ))
                      ) : (
                        <span className="text-base-content/40">—</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col gap-1">
                      {uniqueProjects.length > 0 ? (
                        uniqueProjects.map((project) => (
                          <Link
                            key={project.id}
                            className="hover:underline"
                            href={Routes.ShowProjectPage({ projectId: project.id })}
                          >
                            {project.name}
                          </Link>
                        ))
                      ) : (
                        <span className="text-base-content/40">—</span>
                      )}
                    </div>
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
