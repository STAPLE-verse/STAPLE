import React from "react"
import { Task } from "db"

import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"

// TODO: Is it better to call the database for column name every time or just one time and pass the value to child components?
// Column helper
const columnHelper = createColumnHelper<Task>()

// ColumnDefs
export const taskTableColumns = [
  columnHelper.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Name",
  }),
  columnHelper.accessor("description", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Description",
  }),
  // TODO: Check how to use anonym function in accessor to get column name
  columnHelper.accessor("updatedAt", {
    cell: (info) => <span>{info.getValue().toString()}</span>,
    header: "Last update",
  }),
  columnHelper.accessor("id", {
    id: "view",
    header: "",
    cell: (info) => (
      <Link
        className="btn btn-primary"
        href={Routes.ShowTaskPage({
          projectId: info.row.original.projectId,
          taskId: info.getValue(),
        })}
      >
        Open
      </Link>
    ),
  }),
]
