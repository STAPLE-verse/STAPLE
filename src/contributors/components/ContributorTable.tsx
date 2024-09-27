import React from "react"
import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"

// Define return type for the columns
export type ContributorInformation = {
  name: string
  id: number
  projectId?: number
}

// Column helper
const columnHelper = createColumnHelper<ContributorInformation>()

// ColumnDefs
export const pmContributorTableColumns = [
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
  columnHelper.accessor("id", {
    id: "edit",
    header: "Edit",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <div>
        <Link
          className="btn btn-primary"
          href={Routes.EditContributorPage({
            projectId: info.row.original.projectId!,
            contributorId: info.getValue(),
          })}
        >
          Edit Contributor
        </Link>
      </div>
    ),
  }),
]

export const contributorContributorTableColumns = [
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
