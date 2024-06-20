import React from "react"
import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"

export type TeamInformation = {
  name: string
  id: number
  projectId?: number
}
// TODO: Is it better to call the database for column name every time or just one time and pass the value to child components?
// Column helper
const columnHelper = createColumnHelper<TeamInformation>()

// ColumnDefs
export const teamTableColumns = [
  columnHelper.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Team Name",
  }),

  columnHelper.accessor("id", {
    id: "view",
    header: "View",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <div className="">
        <Link
          className="btn btn-primary"
          href={Routes.ShowTeamPage({
            projectId: info.row.original.projectId!,
            teamId: info.getValue(),
          })}
        >
          See Contributions
        </Link>
      </div>
    ),
  }),

  columnHelper.accessor("id", {
    id: "edit",
    header: "Edit",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <div className="">
        <Link
          className="btn btn-primary"
          href={Routes.EditTeamPage({
            projectId: info.row.original.projectId!,
            teamId: info.getValue(),
          })}
        >
          Edit Team
        </Link>
      </div>
    ),
  }),
]
