import React from "react"
import { createColumnHelper } from "@tanstack/react-table"
import DateFormat from "src/core/components/DateFormat"
import { DeleteInvite } from "src/invites/components/DeleteInvite"

// Define return type for the columns
export type InviteTablePMData = {
  createdAt: Date
  email: string
  invitationCode: string
  id: number
}

// use column helper
const columnHelper = createColumnHelper<InviteTablePMData>()

// ColumnDefs
export const InviteTablePMColumns = [
  columnHelper.accessor("createdAt", {
    cell: (info) => <DateFormat date={info.getValue()}></DateFormat>,
    header: "Date",
  }),
  columnHelper.accessor("email", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Email",
  }),
  columnHelper.accessor("invitationCode", {
    header: "Invitation Code",
    cell: (info) => <span>{info.getValue()}</span>,
  }),
  columnHelper.accessor("id", {
    id: "decline",
    header: "Delete",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <DeleteInvite row={info.row.original}></DeleteInvite>,
  }),
]
