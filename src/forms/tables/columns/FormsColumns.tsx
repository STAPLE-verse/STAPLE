import React from "react"
import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { JsonFormModal } from "src/core/components/JsonFormModal"
import DateFormat from "src/core/components/DateFormat"
import ArchiveFormButton from "../../components/ArchiveFormButton"
import { MagnifyingGlassIcon, PencilSquareIcon } from "@heroicons/react/24/outline"
import { FormTableData } from "../processing/processForms"
import { createDateTextFilter } from "src/core/utils/tableFilters"

// Column helper
const columnHelper = createColumnHelper<FormTableData>()
const lastUpdateFilter = createDateTextFilter({ emptyLabel: "no date" })

// ColumnDefs
export const FormsColumns = [
  columnHelper.accessor("name", {
    cell: (info) => (
      <Link className="font-medium hover:underline" href={`/forms/${info.row.original.id}`}>
        {info.getValue()}
      </Link>
    ),
    header: "Name",
  }),
  columnHelper.accessor("folder", {
    id: "folder",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => {
      const folder = info.getValue()
      return folder ? (
        <span className="badge badge-outline badge-sm">{folder.name}</span>
      ) : (
        <span className="text-base-content/40 text-sm">—</span>
      )
    },
    header: "Folder",
  }),
  columnHelper.accessor("tags", {
    id: "tags",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => {
      const tags = info.getValue()
      if (!tags || tags.length === 0) return <span className="text-base-content/40 text-sm">—</span>
      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span key={tag} className="badge badge-primary badge-sm">
              {tag}
            </span>
          ))}
        </div>
      )
    },
    header: "Tags",
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
    cell: (info) => <ArchiveFormButton formId={info.getValue()} />,
    header: "Delete",
  }),
]
