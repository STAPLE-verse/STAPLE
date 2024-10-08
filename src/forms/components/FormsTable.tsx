import React from "react"
import { FormVersion, Form } from "db"
import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { JsonFormModal } from "src/core/components/JsonFormModal"
import DateFormat from "src/core/components/DateFormat"
import ArchiveFormButton from "./ArchiveFormButton"
import { MagnifyingGlassIcon, PencilSquareIcon } from "@heroicons/react/24/outline"

export interface FormWithFormVersion extends Form {
  formVersion: FormVersion | null
}

// Column helper
const columnHelper = createColumnHelper<FormWithFormVersion>()

// ColumnDefs
export const formsTableColumns = [
  columnHelper.accessor("formVersion.name", {
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
      const uiSchema = info.row.original.formVersion?.uiSchema || {}
      let extendedUiSchema = {}
      // TODO: This assumes uiSchema is always an object, although the type def allows for string, number(?) as well
      // I am not sure where would we encounter those
      if (uiSchema && typeof uiSchema === "object" && !Array.isArray(uiSchema)) {
        // We do not want to show the submit button
        extendedUiSchema = {
          ...uiSchema,
          "ui:submitButtonOptions": {
            norender: true,
          },
        }
      }
      return (
        <>
          <JsonFormModal
            schema={info.row.original.formVersion?.schema!}
            uiSchema={extendedUiSchema}
            metadata={{}}
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
