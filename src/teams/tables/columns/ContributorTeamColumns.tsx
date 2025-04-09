import React from "react"
import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { TeamData } from "../processing/processTeam"

// Column helper
const columnHelper = createColumnHelper<TeamData>()

// ColumnDefs
export const ContributorTeamColumns = [
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
      <div>
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
]
