import React from "react"
import { FormVersion, Form } from "db"
import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { JsonFormModal } from "src/core/components/JsonFormModal"
import DateFormat from "src/core/components/DateFormat"
import ArchiveFormButton from "../../components/ArchiveFormButton"
import { MagnifyingGlassIcon, PencilSquareIcon } from "@heroicons/react/24/outline"
import { FormTableData } from "../processing/processFormsTableData"

// Column helper
const columnHelper = createColumnHelper<FormTableData>()

// ColumnDefs
export const formsTableColumns = [
  columnHelper.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Name",
  }),
  columnHelper.accessor("updatedAt", {
    cell: (info) => <DateFormat date={info.getValue()}></DateFormat>,
    header: "Last Update",
  }),
  columnHelper.accessor((row) => "view", {
    id: "view",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => {
      return (
        <>
          <JsonFormModal
            schema={info.row.original.schema}
            uiSchema={info.row.original.uiSchema}
            metadata={{}} // Adjust metadata as needed
            label={<MagnifyingGlassIcon width={25} className="stroke-primary" />}
            classNames="btn-ghost"
          />
        </>
      )
    },
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
