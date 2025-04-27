import React from "react"
import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import DateFormat from "src/core/components/DateFormat"
import { MagnifyingGlassIcon, ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline"
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
  columnHelperAll.accessor("newCommentsCount", {
    header: "Comments",
    id: "newComments",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => {
      const count = info.getValue()
      return (
        <div className="relative flex items-center justify-center w-fit">
          <ChatBubbleOvalLeftEllipsisIcon
            className={`h-7 w-7 ${count > 0 ? "text-primary" : "opacity-30"}`}
          />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-error text-xs text-white flex items-center justify-center">
              {count}
            </span>
          )}
        </div>
      )
    },
  }),
]
