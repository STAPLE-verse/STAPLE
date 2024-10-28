import React from "react"
import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import DateFormat from "src/core/components/DateFormat"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { AllTasksData } from "../processing/processAllTasks"

// Column helper
const columnHelperAll = createColumnHelper<AllTasksData>()

// ColumnDefs
export const AllTasksColumns = [
  columnHelperAll.accessor("name", {
    enableColumnFilter: true,
    enableSorting: true,
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Name",
    meta: {
      filterVariant: "text",
    },
  }),
  columnHelperAll.accessor("projectName", {
    enableColumnFilter: true,
    enableSorting: true,
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Project",
    meta: {
      filterVariant: "select",
    },
  }),
  columnHelperAll.accessor("deadline", {
    enableColumnFilter: true,
    enableSorting: true,
    cell: (info) => <DateFormat date={info.getValue()}></DateFormat>,
    header: "Due Date",
    meta: {
      filterVariant: "text",
    },
  }),
  columnHelperAll.accessor("completion", {
    header: "Completion",
    enableColumnFilter: true,
    enableSorting: true,
    cell: (info) => <span>{info.getValue()}%</span>,
    meta: {
      filterVariant: "range",
    },
  }),
  columnHelperAll.accessor("view", {
    header: "View",
    id: "view",
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
