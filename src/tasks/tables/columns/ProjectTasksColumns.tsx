import React from "react"
import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import DateFormat from "src/core/components/DateFormat"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { ProjectTasksData } from "../processing/processProjectTasks"

// Column helper
const columnHelperProject = createColumnHelper<ProjectTasksData>()

// ColumnDefs
export const ProjectTasksColumns = [
  columnHelperProject.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Name",
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      filterVariant: "text",
    },
  }),
  columnHelperProject.accessor("description", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Description",
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      filterVariant: "text",
    },
  }),
  columnHelperProject.accessor("deadline", {
    cell: (info) => <DateFormat date={info.getValue()}></DateFormat>,
    header: "Due Date",
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      filterVariant: "text",
    },
  }),
  columnHelperProject.accessor("status", {
    header: "Completed",
    cell: (info) => <span>{info.getValue()}</span>,
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      filterVariant: "select",
    },
  }),
  columnHelperProject.accessor("view", {
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
