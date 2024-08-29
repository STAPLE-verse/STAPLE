import React from "react"
import { createColumnHelper } from "@tanstack/react-table"
import DateFormat from "src/core/components/DateFormat"
import { EnumValues } from "zod"

// Define return type for the columns
export type Invite = {
  createdAt: Date
  project?: { name: string }
  invitationCode: string
  id: number
}

const columnHelper = createColumnHelper<Invite>()

// ColumnDefs
export const inviteTableColumns = [
  columnHelper.accessor("createdAt", {
    cell: (info) => <DateFormat date={info.getValue()}></DateFormat>,
    header: "Date",
  }),
  columnHelper.accessor("project.name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Project",
  }),
  columnHelper.accessor("invitationCode", {
    header: "Invitation Code",
    cell: (info) => <span>{info.getValue()}</span>,
  }),
  columnHelper.accessor("id", {
    id: "accept",
    header: "Accept",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <button>Accept</button>,
  }),
  columnHelper.accessor("id", {
    id: "decline",
    header: "Decline",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <button>Decline</button>,
  }),
]
