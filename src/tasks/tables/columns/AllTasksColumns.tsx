import React from "react"
import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import DateFormat from "src/core/components/DateFormat"
import { MagnifyingGlassIcon, ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline"
import { AllTasksData } from "../processing/processAllTasks"
import { createDateTextFilter } from "src/core/utils/tableFilters"

// Column helper
const columnHelperAll = createColumnHelper<AllTasksData>()

// Long names are shortened so the button keeps its height (same rule as the project tasks table)
const truncateName = (name: string) => (name.length > 20 ? `${name.slice(0, 20)}...` : name)

const dueDateTextFilter = createDateTextFilter({ emptyLabel: "no due date" })

// ColumnDefs
export const AllTasksColumns = [
  columnHelperAll.accessor("name", {
    enableColumnFilter: true,
    enableSorting: true,
    cell: (info) => {
      const { taskId, projectId } = info.row.original.view
      const name = info.getValue()
      return (
        <Link
          className="btn btn-primary w-full"
          href={Routes.ShowTaskPage({ projectId, taskId })}
          title={name}
        >
          {truncateName(name)}
        </Link>
      )
    },
    header: "Name",
    meta: {
      filterVariant: "text",
    },
  }),
  columnHelperAll.accessor("projectName", {
    enableColumnFilter: true,
    enableSorting: true,
    cell: (info) => (
      <Link
        className="btn btn-secondary w-full"
        href={Routes.ShowProjectPage({ projectId: info.row.original.view.projectId })}
        title={info.getValue()}
      >
        {truncateName(info.getValue())}
      </Link>
    ),
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
    filterFn: dueDateTextFilter,
    meta: {
      filterVariant: "text",
    },
  }),
  columnHelperAll.accessor("completion", {
    header: "Completion",
    enableColumnFilter: true,
    enableSorting: true,
    cell: (info) => (
      <div className="flex w-full justify-center items-center">{info.getValue()}%</div>
    ),
    meta: {
      filterVariant: "range",
    },
  }),
  columnHelperAll.accessor("approved", {
    header: "Approved",
    enableColumnFilter: true,
    enableSorting: true,
    cell: (info) => (
      <div className="flex w-full justify-center items-center">{info.getValue()}%</div>
    ),
    meta: {
      filterVariant: "range",
    },
  }),
  columnHelperAll.accessor("newCommentsCount", {
    header: "Comments",
    id: "newComments",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => {
      const count = info.getValue().countTotal
      return (
        <div className="relative flex items-center justify-center w-full">
          <Link
            className="btn btn-ghost"
            href={Routes.ShowTaskPage({
              projectId: info.getValue().projectId,
              taskId: info.getValue().taskId,
            })}
          >
            <div className="flex items-center justify-center relative">
              <ChatBubbleOvalLeftEllipsisIcon
                className={`h-7 w-7 ${count > 0 ? "text-primary" : "opacity-30"}`}
              />
              {count > 0 && (
                <div className="flex items-center justify-center absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-white">
                  {count}
                </div>
              )}
            </div>
          </Link>
        </div>
      )
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
