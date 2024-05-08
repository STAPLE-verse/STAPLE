import React from "react"
import { Forms } from "db"

import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"

// TODO: Is it better to call the database for column name every time or just one time and pass the value to child components?
// Column helper
const columnHelper = createColumnHelper<Forms>()

// ColumnDefs
export const formsTableColumns = [
  columnHelper.accessor("schema", {
    cell: (info) => <span>{info.getValue().title}</span>,
    header: "Name",
  }),
]
