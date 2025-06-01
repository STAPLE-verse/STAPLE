import React from "react"
import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { TeamData } from "../processing/processTeam"
import { ContributorTeamColumns } from "./ContributorTeamColumns"

// Column helper
const columnHelper = createColumnHelper<TeamData>()

export const PmTeamColumns = [
  ...ContributorTeamColumns,
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
