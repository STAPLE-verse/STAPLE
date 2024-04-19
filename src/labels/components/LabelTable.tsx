import React from "react"
import { Task } from "db"

import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"

export type ContributorLabelInformation = {
  name: string
  id: number
  userId?: number
}
// TODO: Is it better to call the database for column name every time or just one time and pass the value to child components?
// Column helper
const columnHelper = createColumnHelper<ContributorLabelInformation>()

// ColumnDefs
export const contributorLableTableColumns = [
  columnHelper.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Label Name",
  }),

  // columnHelper.accessor("id", {
  //   id: "view",
  //   header: "",
  //   enableColumnFilter: false,
  //   enableSorting: false,
  //   cell: (info) => (
  //     <div className="justify-end">
  //       <Link
  //         className="btn "
  //         href={Routes.ShowContributorPage({
  //           projectId: info.row.original.userId!,
  //           contributorId: info.getValue(),
  //         })}
  //       >
  //         See contributions
  //       </Link>
  //     </div>
  //   ),
  // }),
]
