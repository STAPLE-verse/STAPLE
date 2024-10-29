import React from "react"
import { createColumnHelper } from "@tanstack/react-table"
import DateFormat from "src/core/components/DateFormat"
import { AcceptInvite } from "src/invites/components/AcceptInvite"
import { DeleteInvite } from "src/invites/components/DeleteInvite"

// Define return type for the columns
export type InviteTableData = {
  createdAt: Date
  project?: { name: string }
  invitationCode: string
  id: number
}

// use column helper
const columnHelper = createColumnHelper<InviteTableData>()

// ColumnDefs
export const InviteColumns = [
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
    cell: (info) => <AcceptInvite row={info.row.original}></AcceptInvite>,
  }),
  columnHelper.accessor("id", {
    id: "decline",
    header: "Decline",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <DeleteInvite row={info.row.original}></DeleteInvite>,
  }),
]
