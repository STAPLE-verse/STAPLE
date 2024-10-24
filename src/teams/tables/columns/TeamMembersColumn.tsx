import { ColumnDef, createColumnHelper } from "@tanstack/react-table"

// Define type for table
export type TeamMembers = {
  username: string
}

// Create columnHelper
const columnHelper = createColumnHelper<TeamMembers>()

// ColumnDefs
export const TeamMembersColumn: ColumnDef<TeamMembers>[] = [
  columnHelper.accessor("username", {
    cell: (info) => <span>{`${info.row.original.username}`}</span>,
    header: "Username",
  }),
]
