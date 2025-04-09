import { Routes } from "@blitzjs/next"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"

// Define type for table
export type TeamMembers = {
  contributorId: number
  projectId: number
  username: string
  firstName: string
  lastName: string
}

// Create columnHelper
const columnHelper = createColumnHelper<TeamMembers>()

// ColumnDefs
export const TeamMembersColumn: ColumnDef<TeamMembers>[] = [
  columnHelper.accessor("username", {
    cell: (info) => (
      <Link
        className="btn btn-primary"
        href={Routes.ShowContributorPage({
          projectId: info.row.original.projectId,
          contributorId: info.row.original.contributorId,
        })}
      >
        {`${info.row.original.username}`}
      </Link>
    ),
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
