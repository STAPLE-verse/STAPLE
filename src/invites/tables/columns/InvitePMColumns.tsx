import React from "react"
import { createColumnHelper } from "@tanstack/react-table"
import DateFormat from "src/core/components/DateFormat"
import { DeleteInvite } from "src/invites/components/DeleteInvite"
import { createDateTextFilter } from "src/core/utils/tableFilters"

// Define return type for the columns
export type InviteTablePMData = {
  createdAt: Date
  email: string
  invitationCode: string
  id: number
}

// use column helper
const columnHelper = createColumnHelper<InviteTablePMData>()
const invitePMDateFilter = createDateTextFilter({ emptyLabel: "no date" })

// ColumnDefs
export const InvitePMColumns = [
  columnHelper.accessor("createdAt", {
    cell: (info) => <DateFormat date={info.getValue()}></DateFormat>,
    header: "Date",
    enableColumnFilter: true,
    enableSorting: true,
    filterFn: invitePMDateFilter,
    meta: {
      filterVariant: "text",
    },
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
