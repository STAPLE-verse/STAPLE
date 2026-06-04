import { useCallback, useMemo } from "react"
import { useMutation } from "@blitzjs/rpc"
import toast from "react-hot-toast"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { createColumnHelper } from "@tanstack/react-table"
import deleteFormVersion from "src/forms/mutations/deleteFormVersion"
import { FormVersionWithRelations } from "src/forms/queries/getForm"
import { TrashIcon } from "@heroicons/react/24/outline"
import Table from "src/core/components/Table"

type VersionRow = {
  id: number
  version: number
  name: string
  isArchived: boolean
  isInUse: boolean
  tasks: { id: number; name: string; project: { id: number; name: string } }[]
  uniqueProjects: { id: number; name: string }[]
}

const columnHelper = createColumnHelper<VersionRow>()

type Props = {
  versions: FormVersionWithRelations[]
  currentVersionId?: number
  formArchived?: boolean
  onDeleted?: () => Promise<void> | void
}

export default function FormDeployments({
  versions,
  currentVersionId: _currentVersionId,
  formArchived = false,
  onDeleted,
}: Props) {
  const [deleteFormVersionMutation] = useMutation(deleteFormVersion)
  const handleDelete = useCallback(
    async (versionId: number, isInUse: boolean) => {
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
    },
    [deleteFormVersionMutation, onDeleted]
  )

  const tableData = useMemo<VersionRow[]>(
    () =>
      versions.map((version) => {
        const allProjects = [...version.projects, ...version.tasks.map((t) => t.project)]
        return {
          id: version.id,
          version: version.version,
          name: version.name,
          isArchived: !!version.archived || formArchived,
          isInUse: version.tasks.length > 0 || version.projects.length > 0,
          tasks: version.tasks,
          uniqueProjects: Array.from(new Map(allProjects.map((p) => [p.id, p])).values()),
        }
      }),
    [versions, formArchived]
  )

  const columns = useMemo(
    () => [
      columnHelper.accessor("version", {
        header: "Version",
        enableSorting: true,
        enableColumnFilter: false,
        cell: (info) => `v${info.getValue()}`,
      }),
      columnHelper.accessor("name", {
        header: "Name",
        enableSorting: true,
        enableColumnFilter: true,
        meta: { filterVariant: "text" },
      }),
      columnHelper.accessor("tasks", {
        header: "Tasks",
        enableSorting: false,
        enableColumnFilter: false,
        cell: (info) => {
          const tasks = info.getValue()
          if (tasks.length === 0) return <span className="text-base-content/40">—</span>
          return (
            <div className="flex flex-wrap gap-2">
              {tasks.map((task) => (
                <Link
                  key={task.id}
                  className="btn btn-sm btn-primary"
                  href={Routes.ShowTaskPage({ projectId: task.project.id, taskId: task.id })}
                >
                  {task.name}
                </Link>
              ))}
            </div>
          )
        },
      }),
      columnHelper.accessor("uniqueProjects", {
        header: "Projects",
        enableSorting: false,
        enableColumnFilter: false,
        cell: (info) => {
          const projects = info.getValue()
          if (projects.length === 0) return <span className="text-base-content/40">—</span>
          return (
            <div className="flex flex-col gap-2 items-start">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  className="btn btn-sm btn-secondary"
                  href={Routes.ShowProjectPage({ projectId: project.id })}
                >
                  {project.name}
                </Link>
              ))}
            </div>
          )
        },
      }),
      columnHelper.display({
        id: "delete",
        header: "Delete",
        enableSorting: false,
        enableColumnFilter: false,
        cell: (info) =>
          info.row.original.isInUse ? (
            <span className="badge badge-warning whitespace-nowrap">in use</span>
          ) : (
            <button
              type="button"
              className="btn btn-ghost text-primary"
              onClick={() => void handleDelete(info.row.original.id, false)}
              title="Delete version"
            >
              <TrashIcon className="w-6 h-6" />
            </button>
          ),
      }),
    ],
    [handleDelete]
  )

  if (versions.length === 0) {
    return <p className="text-md italic text-base-content/80">No form versions found.</p>
  }

  return <Table columns={columns} data={tableData} addPagination={false} />
}
