import React from "react"
import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { ContributorTableData } from "../processing/processContributor"

// Column helper
const columnHelper = createColumnHelper<ContributorTableData>()

// ColumnDefs
const commonColumns = [
  columnHelper.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Contributor",
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
          href={Routes.ShowContributorPage({
            projectId: info.row.original.projectId!,
            contributorId: info.getValue(),
          })}
        >
          See Contributions
        </Link>
      </div>
    ),
  }),
]

export const ProjectManagerContributorColumns = [
  ...commonColumns,
  columnHelper.accessor("id", {
    id: "edit",
    header: "Edit",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <Link
        className="btn btn-primary"
        href={Routes.EditContributorPage({
          projectId: info.row.original.projectId!,
          contributorId: info.getValue(),
        })}
      >
        Edit Contributor
      </Link>
    ),
  }),
]

export const StandardContributorColumns = [...commonColumns]
