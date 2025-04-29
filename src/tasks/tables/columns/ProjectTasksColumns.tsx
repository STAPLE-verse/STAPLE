import React from "react"
import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import DateFormat from "src/core/components/DateFormat"
import {
  MagnifyingGlassIcon,
  InformationCircleIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/outline"
import { ProjectTasksData } from "../processing/processProjectTasks"
import { Tooltip } from "react-tooltip"

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
  columnHelperProject.accessor("container", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: (
      <div className="table-header-tooltip">
        Status
        <InformationCircleIcon
          className="h-4 w-4 ml-1 text-info stroke-2"
          data-tooltip-id="status-tooltip"
        />
        <Tooltip
          id="status-tooltip"
          content="Status indicates the kanban column this task is currently in."
          className="z-[1099] ourtooltips"
        />
      </div>
    ),
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
    header: () => (
      <div className="table-header-tooltip">
        Completed
        <InformationCircleIcon
          className="h-4 w-4 ml-1 text-info stroke-2"
          data-tooltip-id="task-status-tooltip"
        />
        <Tooltip
          id="task-status-tooltip"
          content="Marked complete by the project manager, regardless of whether all parts are finished."
          className="z-[1099] ourtooltips"
        />
      </div>
    ),
    cell: (info) => <span>{info.getValue()}</span>,
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      filterVariant: "select",
    },
  }),
  columnHelperProject.accessor("percentComplete", {
    header: () => (
      <div className="table-header-tooltip">
        Percent Complete
        <InformationCircleIcon
          className="h-6 w-6 ml-1 text-info stroke-2"
          data-tooltip-id="task-percent-tooltip"
        />
        <Tooltip
          id="task-percent-tooltip"
          content="The percentage of individual assignments that have been completed for this task."
          className="z-[1099] ourtooltips"
        />
      </div>
    ),
    cell: (info) => <span>{info.getValue()}</span>,
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      filterVariant: "range",
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
  columnHelperProject.accessor("newCommentsCount", {
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
