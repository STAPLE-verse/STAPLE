import React from "react"
import { Task } from "db"

import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"

// TODO: Is it better to call the database for column name every time or just one time and pass the value to child components?
// Column helper
const columnHelper = createColumnHelper<Task>()

// ColumnDefs
export const taskTableColumns = [
  columnHelper.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Name",
  }),
  columnHelper.accessor("project.name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Project",
  }),
  // TODO: Check how to use anonym function in accessor to get column name
  columnHelper.accessor("deadline", {
    cell: (info) => (
      <span>
        {info.getValue()?.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false, // Use 24-hour format
        })}
      </span>
    ),
    header: "Due Date",
  }),
  columnHelper.accessor("assignees", {
    header: "Completed",
    cell: (info) => {
      const value = info.getValue() as String[]
      const answer = value.map((v) => v.statusLogs[0].status)
      return <>{answer[0] === "COMPLETED" ? "Complete" : "Not Complete"}</>
    },
  }),
  columnHelper.accessor("id", {
    id: "view",
    header: "View",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <Link
        className="btn btn-primary"
        href={Routes.ShowTaskPage({
          projectId: info.row.original.projectId,
          taskId: info.getValue(),
        })}
      >
        View
      </Link>
    ),
  }),
]

export const taskFinishedTableColumns = [
  columnHelper.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Name",
  }),
  columnHelper.accessor("project.name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Project",
  }),
  columnHelper.accessor("id", {
    id: "view",
    header: "View",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <Link
        className="btn btn-primary"
        href={Routes.ShowTaskPage({
          projectId: info.row.original.projectId,
          taskId: info.getValue(),
        })}
      >
        View
      </Link>
    ),
  }),
]

export const taskProjectTableColumnsContrib = [
  columnHelper.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Name",
  }),
  columnHelper.accessor("description", {
    cell: (info) => (
      <span>{info.getValue() === null ? "No Description" : info.getValue().substring(0, 50)}</span>
    ),
    header: "Description",
  }),
  // TODO: Check how to use anonym function in accessor to get column name
  columnHelper.accessor("deadline", {
    cell: (info) => (
      <span>
        {info.getValue()?.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false, // Use 24-hour format
        })}
      </span>
    ),
    header: "Due Date",
  }),
  columnHelper.accessor("assignees", {
    header: "Completed",
    cell: (info) => {
      const value = info.getValue() as String[]
      const answer = value.map((v) => v.statusLogs[0].status)
      return <>{answer[0] === "COMPLETED" ? "Complete" : "Not Complete"}</>
    },
  }),
  columnHelper.accessor("id", {
    id: "view",
    header: "View",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <Link
        className="btn btn-primary"
        href={Routes.ShowTaskPage({
          projectId: info.row.original.projectId,
          taskId: info.getValue(),
        })}
      >
        View
      </Link>
    ),
  }),
]

export const taskProjectTableColumnsPM = [
  columnHelper.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Name",
  }),
  columnHelper.accessor("description", {
    cell: (info) => (
      <span>{info.getValue() === null ? "No Description" : info.getValue().substring(0, 50)}</span>
    ),
    header: "Description",
  }),
  // TODO: Check how to use anonym function in accessor to get column name
  columnHelper.accessor("deadline", {
    cell: (info) => (
      <span>
        {info.getValue()?.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false, // Use 24-hour format
        })}
      </span>
    ),
    header: "Due Date",
  }),
  columnHelper.accessor("status", {
    header: "Completed",
    cell: (info) => <span>{info.getValue() === "COMPLETED" ? "Completed" : "Not Completed"}</span>,
  }),
  columnHelper.accessor("id", {
    id: "view",
    header: "View",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <Link
        className="btn btn-primary"
        href={Routes.ShowTaskPage({
          projectId: info.row.original.projectId,
          taskId: info.getValue(),
        })}
      >
        View
      </Link>
    ),
  }),
]

export const taskElementColumns = [
  columnHelper.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Name",
    enableSorting: false,
    enableColumnFilter: false,
  }),
  columnHelper.accessor("deadline", {
    cell: (info) => (
      <span>
        {info.getValue()?.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false, // Use 24-hour format
        })}
      </span>
    ),
    header: "Due Date",
    enableSorting: false,
    enableColumnFilter: false,
  }),
  columnHelper.accessor("status", {
    header: "Completed",
    enableSorting: false,
    enableColumnFilter: false,
    cell: (info) => <span>{info.getValue() === "COMPLETED" ? "Completed" : "Not Completed"}</span>,
  }),
  columnHelper.accessor("id", {
    id: "view",
    header: "View",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <Link
        className="btn btn-primary"
        href={Routes.ShowTaskPage({
          projectId: info.row.original.projectId,
          taskId: info.getValue(),
        })}
      >
        View
      </Link>
    ),
  }),
]
