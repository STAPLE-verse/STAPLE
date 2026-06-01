import React from "react"
import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { JsonFormModal } from "src/core/components/JsonFormModal"
import DateFormat from "src/core/components/DateFormat"
import ArchiveFormButton from "../../components/ArchiveFormButton"
import DeleteFormButton from "../../components/DeleteFormButton"
import { MagnifyingGlassIcon, PencilSquareIcon } from "@heroicons/react/24/outline"
import { FormTableData } from "../processing/processForms"
import { createDateTextFilter } from "src/core/utils/tableFilters"
import FolderCell from "./FolderCell"
import FolderHeaderSelect from "./FolderHeaderSelect"

const columnHelper = createColumnHelper<FormTableData>()
const lastUpdateFilter = createDateTextFilter({ emptyLabel: "no date" })

const exactTagFilter = (row: any, columnId: string, filterValue: unknown) => {
  const search = String(filterValue ?? "")
    .trim()
    .toLowerCase()
  if (!search) {
    return true
  }

  const tags = row.getValue(columnId)
  return Array.isArray(tags) && tags.some((tag) => String(tag).trim().toLowerCase() === search)
}

export const getFormsColumns = (
  onFolderFilterChange?: (folderId: number | null | "all") => void,
  onFormsUpdated?: () => Promise<void> | void
) => [
  columnHelper.accessor("name", {
    cell: (info) => (
      <Link
        className="font-medium hover:underline"
        href={Routes.FormEditPage({ formsId: info.row.original.id })}
      >
        {info.getValue()}
      </Link>
    ),
    header: "Name",
  }),
  columnHelper.accessor("folder", {
    id: "folder",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <FolderCell formId={info.row.original.id} currentFolderId={info.getValue()?.id ?? null} />
    ),
    header: () => (
      <div className="flex flex-col gap-1">
        <span>Folder</span>
        <FolderHeaderSelect onChange={onFolderFilterChange} />
      </div>
    ),
  }),
  columnHelper.accessor("tags", {
    id: "tags",
    enableColumnFilter: true,
    enableSorting: false,
    filterFn: exactTagFilter,
    cell: (info) => {
      const tags = info.getValue()
      if (!tags || tags.length === 0) return <span className="text-base-content/40 text-sm">—</span>
      const visible = tags.slice(0, 3)
      const hidden = tags.slice(3)
      return (
        <div className="flex flex-wrap gap-1 items-center">
          {visible.map((tag) => (
            <span key={tag} className="badge badge-secondary badge-sm">
              {tag}
            </span>
          ))}
          {hidden.length > 0 && (
            <div className="tooltip" data-tip={hidden.join(", ")}>
              <span className="ml-1 text-secondary cursor-default">+{hidden.length}</span>
            </div>
          )}
        </div>
      )
    },
    header: "Tags",
    meta: {
      filterVariant: "text",
      filterPlaceholder: "Filter by tag",
    },
  }),
  columnHelper.accessor("updatedAt", {
    cell: (info) => <DateFormat date={info.getValue()}></DateFormat>,
    header: "Last Update",
    enableColumnFilter: true,
    enableSorting: true,
    filterFn: lastUpdateFilter,
    meta: {
      filterVariant: "text",
    },
  }),
  columnHelper.accessor((row) => "view", {
    id: "view",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <JsonFormModal
        schema={info.row.original.schema}
        uiSchema={info.row.original.uiSchema}
        metadata={{}} // Adjust metadata as needed
        label={<MagnifyingGlassIcon width={25} className="stroke-primary" />}
        classNames="btn-ghost"
        submittable={false}
      />
    ),
    header: "View",
  }),
  columnHelper.accessor("id", {
    id: "edit",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <Link className="btn btn-ghost" href={Routes.FormEditPage({ formsId: info.getValue() })}>
        <PencilSquareIcon width={25} className="stroke-primary" />
      </Link>
    ),
    header: "Edit",
  }),
  columnHelper.accessor("id", {
    id: "delete",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <ArchiveFormButton
        formId={info.getValue()}
        isArchived={info.row.original.archived}
        onDone={onFormsUpdated}
      />
    ),
    header: "Archive",
  }),
  columnHelper.accessor("id", {
    id: "remove",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <DeleteFormButton formId={info.getValue()} onDeleted={onFormsUpdated} />,
    header: "Delete",
  }),
]
