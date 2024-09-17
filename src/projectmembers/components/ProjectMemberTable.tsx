import React from "react"
import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"

// Define return type for the columns
export type ProjectMemberInformation = {
  name: string
  id: number
  projectId?: number
}

// Column helper
const columnHelper = createColumnHelper<ProjectMemberInformation>()

// ColumnDefs
export const pmProjectMemberTableColumns = [
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
          href={Routes.ShowProjectMemberPage({
            projectId: info.row.original.projectId!,
            projectMemberId: info.getValue(),
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
          href={Routes.EditProjectMemberPage({
            projectId: info.row.original.projectId!,
            projectMemberId: info.getValue(),
          })}
        >
          Edit Contributor
        </Link>
      </div>
    ),
  }),
]

export const projectMemberProjectMemberTableColumns = [
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
          href={Routes.ShowProjectMemberPage({
            projectId: info.row.original.projectId!,
            projectMemberId: info.getValue(),
          })}
        >
          See Contributions
        </Link>
      </div>
    ),
  }),
]
