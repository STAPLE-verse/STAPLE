import React from "react"
import { createColumnHelper } from "@tanstack/react-table"
import DateFormat from "src/core/components/DateFormat"
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline"

// Define return type for the columns
export type Invite = {
  createdAt: Date
  project?: { name: string }
  invitationCode: string
  id: number
  email: string
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
    cell: (info) => <CheckCircleIcon width={50}>Accept</CheckCircleIcon>,
  }),
  columnHelper.accessor("id", {
    id: "decline",
    header: "Decline",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <XCircleIcon width={50}>Decline</XCircleIcon>,
  }),
]

// ColumnDefs
export const inviteTableColumnsPM = [
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
    cell: (info) => <XCircleIcon width={50}>Decline</XCircleIcon>,
  }),
]
