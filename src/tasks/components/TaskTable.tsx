// @ts-nocheck

import React from "react"
import { Task } from "db"

import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { zipJsonsDownload, testData } from "src/services/jsonDownLoad"

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
  columnHelper.accessor("labels", {
    cell: (info) => {
      let temp
      temp = info.getValue().map((i) => i.name)
      return <span>{temp.join(", ")}</span>
    },
    header: "Labels",
  }),
  columnHelper.accessor("assignees", {
    cell: (info) => {
      const varName = "statusLogs"
      const temp = info.getValue()[0].statusLogs[0].createdAt?.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Use 24-hour format
      })
      return <span>{temp}</span>
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
        return "No labels assigned to the task"
      }
    },
    header: "Labels",
    id: "label",
  }),
  columnHelper.accessor("assignees", {
    cell: (info) => {
      const temp = info.getValue()[0].statusLogs[0].createdAt?.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Use 24-hour format
      })
      return <span>{temp}</span>
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

export const DownloadButton = ({ row }) => {
  const downloadName = `${row.name}_${row.id}`
  const handleDownload = () => {
    zipJsonsDownload(downloadName, testData)
  }
  return (
    <div className="">
      <div>
        <button type="button" className="btn btn-primary" onClick={handleDownload}>
          Download
        </button>
      </div>
    </div>
  )
}

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
  columnHelper.accessor("id", {
    id: "download",
    header: "Download",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <DownloadButton row={info.row.original}></DownloadButton>,
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
