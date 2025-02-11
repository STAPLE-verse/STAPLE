import { ColumnDef, createColumnHelper } from "@tanstack/react-table"

// Define type for table
export type TeamMembers = {
  username: string
  firstName: string
  lastName: string
}

// Create columnHelper
const columnHelper = createColumnHelper<TeamMembers>()

// ColumnDefs
export const TeamMembersColumn: ColumnDef<TeamMembers>[] = [
  columnHelper.accessor("username", {
    cell: (info) => <span>{`${info.row.original.username}`}</span>,
    header: "Username",
  }),
  columnHelper.accessor("firstName", {
    cell: (info) => <span>{`${info.row.original.firstName}`}</span>,
    header: "First Name",
  }),
  columnHelper.accessor("lastName", {
    cell: (info) => <span>{`${info.row.original.lastName}`}</span>,
    header: "Last Name",
  }),
]
