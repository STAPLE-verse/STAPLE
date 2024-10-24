import React from "react"
import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import DateFormat from "src/core/components/DateFormat"
import {
  ProcessedAllTasks,
  ProcessedFinishedTasks,
  ProcessedProjectTasks,
  ProcessedElementTasks,
} from "../utils/processTasks"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"

// Column helper
const columnHelperAll = createColumnHelper<ProcessedAllTasks>()

// ColumnDefs
export const allTasksTableColumns = [
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

const columnHelperFinished = createColumnHelper<ProcessedFinishedTasks>()

export const finishedTasksTableColumns = [
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

const columnHelperProject = createColumnHelper<ProcessedProjectTasks>()

export const projectTasksTableColumns = [
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
