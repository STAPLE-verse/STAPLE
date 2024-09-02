// @ts-nocheck

import React from "react"
import { Task } from "db"

import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import DateFormat from "src/core/components/DateFormat"

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
    cell: (info) => <DateFormat date={info.getValue()}></DateFormat>,
    header: "Due Date",
  }),
  columnHelper.accessor("assignees", {
    header: "Completed",
    cell: (info) => {
      const assignees = info.getValue()
      const status = assignees.map((assignee) => (
        <span key={assignee.id}>
          {assignee.statusLogs[0].status === "COMPLETED" ? "Complete" : "Not Complete"}
        </span>
      ))
      return <>{status}</>
    },
    // meta: {
    //   filterVariant: "select",
    // },
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
  columnHelper.accessor("labels", {
    cell: (info) => {
      let temp
      temp = info.getValue().map((i) => i.name)
      return <span>{temp.join(", ")}</span>
    },
    header: "Roles",
  }),
  columnHelper.accessor("assignees", {
    cell: (info) => {
      const varName = "statusLogs"
      const temp = info.getValue()[0].statusLogs[0].createdAt
      return <DateFormat date={temp}></DateFormat>
    },
    header: "Completed",
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

export const taskFinishedTableColumnsTeam = [
  columnHelper.accessor("assignees", {
    cell: (info) => {
      const contributorId = info.getValue()[0].statusLogs[0].completedBy
      return <span>{contributorId}</span>
    },
    header: "Completed by",
    id: "completedBy",
  }),
  columnHelper.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Task Name",
    id: "taskName",
  }),
  columnHelper.accessor("labels", {
    cell: (info) => {
      if (info.getValue().length > 0) {
        let temp
        temp = info.getValue().map((i) => i.name)
        return <span>{temp.join(", ")}</span>
      } else {
        return "No roles assigned to the task"
      }
    },
    header: "Roles",
    id: "label",
  }),
  columnHelper.accessor("assignees", {
    cell: (info) => {
      const temp = info.getValue()[0].statusLogs[0].createdAt
      return <DateFormat date={temp}></DateFormat>
    },
    header: "Completed at",
    id: "completedAt",
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
    cell: (info) => <DateFormat date={info.getValue()}></DateFormat>,
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
    cell: (info) => <DateFormat date={info.getValue()}></DateFormat>,
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
    cell: (info) => <DateFormat date={info.getValue()}></DateFormat>,
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
