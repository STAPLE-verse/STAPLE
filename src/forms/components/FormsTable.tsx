// @ts-nocheck
// issue with !.title

import React from "react"
import { Forms } from "db"

import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { JsonFormModal } from "src/core/components/JsonFormModal"

// TODO: Is it better to call the database for column name every time or just one time and pass the value to child components?
// Column helper
const columnHelper = createColumnHelper<Forms>()

// ColumnDefs
export const formsTableColumns = [
  columnHelper.accessor("schema", {
    cell: (info) => <span>{info.getValue()!.title}</span>,
    header: "Name",
  }),
  columnHelper.accessor("updatedAt", {
    cell: (info) => <span>{info.getValue().toISOString()}</span>,
    header: "Updated at",
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
    header: "",
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
    header: "",
  }),
]