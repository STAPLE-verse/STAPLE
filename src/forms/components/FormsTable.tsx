import React from "react"
import { Forms } from "db"
import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { JsonFormModal } from "src/core/components/JsonFormModal"

// TODO: Is it better to call the database for column name every time or just one time and pass the value to child components?
// Column helper
const columnHelper = createColumnHelper<Forms>()

const getTitle = (jsonSchema): string => {
  return jsonSchema != null && jsonSchema.hasOwnProperty("title") ? jsonSchema["title"] : ""
}

// ColumnDefs
export const formsTableColumns = [
  columnHelper.accessor("schema", {
    cell: (info) => <span>{getTitle(info.getValue())}</span>,
    header: "Name",
  }),
  columnHelper.accessor("updatedAt", {
    cell: (info) => (
      <span>
        {info.getValue()?.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false, // Use 24-hour format
        })}
      </span>
    ),
    header: "Last Update",
  }),
  columnHelper.accessor((row) => "view", {
    id: "view",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => {
      const uiSchema = info.row.original.uiSchema || {}
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
            schema={info.row.original.schema}
            uiSchema={extendedUiSchema}
            metadata={{}}
            label="View"
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
      <Link className="btn btn-primary" href={Routes.FormEditPage({ formsId: info.getValue() })}>
        Edit
      </Link>
    ),
    header: "Edit",
  }),
]
