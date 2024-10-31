import React from "react"
import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import DateFormat from "src/core/components/DateFormat"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { FinishedTasksData } from "../processing/processContributorTaskListDone"

// Column helper
const columnHelperFinished = createColumnHelper<FinishedTasksData>()

// ColumnDefs
export const FinishedTasksColumns = [
  columnHelperFinished.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Name",
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      filterVariant: "text",
    },
  }),
  columnHelperFinished.accessor("roles", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Roles",
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      filterVariant: "text",
    },
  }),
  columnHelperFinished.accessor("completedOn", {
    cell: (info) => <DateFormat date={info.getValue()}></DateFormat>,
    header: "Completed",
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      filterVariant: "text",
    },
  }),
  columnHelperFinished.accessor("view", {
    id: "view",
    header: "View",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <Link
        className="btn btn-ghost"
        href={Routes.ShowTaskPage({
          projectId: info.getValue().projectId,
          taskId: info.getValue().taskId,
        })}
      >
        <MagnifyingGlassIcon width={25} className="stroke-primary" />
      </Link>
    ),
  }),
]
