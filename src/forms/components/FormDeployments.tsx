import { useMutation } from "@blitzjs/rpc"
import toast from "react-hot-toast"
import deleteFormVersion from "src/forms/mutations/deleteFormVersion"
import { FormVersionWithRelations } from "src/forms/queries/getForm"
import { TrashIcon } from "@heroicons/react/24/outline"

type Props = {
  versions: FormVersionWithRelations[]
  currentVersionId?: number
  onDeleted?: () => Promise<void> | void
}

export default function FormDeployments({ versions, currentVersionId, onDeleted }: Props) {
  const [deleteFormVersionMutation] = useMutation(deleteFormVersion)

  const handleDelete = async (versionId: number, isCurrent: boolean, isInUse: boolean) => {
    if (isCurrent || isInUse) return

    const confirmed = window.confirm(
      "This form version will be permanently deleted. Are you sure to continue?"
    )

    if (!confirmed) return

    try {
      await toast.promise(deleteFormVersionMutation({ id: versionId }), {
        loading: "Deleting version...",
        success: "Form version deleted.",
        error: (error) =>
          error instanceof Error ? error.message : "Failed to delete form version.",
      })
      await onDeleted?.()
    } catch (error) {
      console.error("Failed to delete form version:", error)
    }
  }

  if (versions.length === 0) {
    return <p className="text-md italic text-base-content/80">No form versions found.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead className="text-xl text-base-content">
          <tr>
            <th>Version</th>
            <th>Name</th>
            <th>Tasks</th>
            <th>Projects</th>
            <th>Usage</th>
            <th />
          </tr>
        </thead>
        <tbody className="text-lg">
          {versions.map((version) => {
            const isCurrent =
              typeof currentVersionId === "number" && version.id === currentVersionId
            const usageCount = version.tasks.length + version.projects.length
            const isInUse = usageCount > 0
            const canDelete = !isCurrent && !isInUse

            return (
              <tr key={version.id}>
                <td>v{version.version}</td>
                <td>{version.name}</td>
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
                <td className="text-right">
                  <button
                    type="button"
                    className={`btn btn-ghost btn-sm ${canDelete ? "text-error" : "btn-disabled"}`}
                    onClick={() => void handleDelete(version.id, isCurrent, isInUse)}
                    disabled={!canDelete}
                    title={
                      isCurrent
                        ? "Current version cannot be deleted"
                        : isInUse
                        ? "Version is attached to a project or task"
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
  )
}
