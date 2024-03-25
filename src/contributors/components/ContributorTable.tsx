import React from "react"
import { Task } from "db"

import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"

export type ContributorInformation = {
  name: string
  id: number
  projectId?: number
}
// TODO: Is it better to call the database for column name every time or just one time and pass the value to child components?
// Column helper
const columnHelper = createColumnHelper<ContributorInformation>()

// ColumnDefs
export const contributorTableColumns = [
  columnHelper.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Contributor",
  }),

  columnHelper.accessor("id", {
    id: "view",
    header: "",
    cell: (info) => (
      <div className="justify-end">
        <Link
          className="btn "
          href={Routes.ShowContributorPage({
            projectId: info.row.original.projectId!,
            contributorId: info.getValue(),
          })}
        >
          See contributions
        </Link>
      </div>
    ),
  }),
]
