import React from "react"
import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import DateFormat from "src/core/components/DateFormat"
import { InformationCircleIcon, ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline"
import { ProjectTasksData } from "../processing/processProjectTasks"
import { Tooltip } from "react-tooltip"
import ChatBox from "src/comments/components/ChatBox"
import ToggleModal from "src/core/components/ToggleModal"

// Column helper
const columnHelperProject = createColumnHelper<ProjectTasksData>()

// ColumnDefs
export const ProjectTasksColumns = [
  columnHelperProject.accessor("name", {
    cell: (info) => {
      const name = info.getValue()
      const displayName = name.length > 20 ? `${name.slice(0, 20)}...` : name
      const { projectId, taskId } = info.row.original.view
      return (
        <Link href={Routes.ShowTaskPage({ projectId, taskId })}>
          <button className="btn btn-primary w-full">{displayName}</button>
        </Link>
      )
    },
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
      filterVariant: "select",
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
          className="h-4 w-4 ml-1 text-info stroke-2"
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
  columnHelperProject.accessor("comments", {
    header: "Comments",
    id: "comments",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => {
      const hasNewComments = info.row.original.newCommentsCount > 0
      return (
        <div className="flex">
          <ToggleModal
            buttonLabel={
              <div className="relative">
                <ChatBubbleOvalLeftEllipsisIcon
                  className={`h-7 w-7 ${hasNewComments ? "text-primary" : "opacity-30"}`}
                  aria-hidden="true"
                />
                {hasNewComments && (
                  <div className="flex items-center justify-center absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-white">
                    {info.row.original.newCommentsCount}
                  </div>
                )}
              </div>
            }
            modalTitle={
              <>
                <span>Comments:</span>
                <span className="italic ml-1">{info.row.original.name}</span>
              </>
            }
            buttonClassName="btn-ghost"
          >
            <ChatBox
              taskLogId={info.row.original.firstLogId!}
              initialComments={info.row.original.comments}
              refetchComments={info.row.original.refetchTasks}
            />
          </ToggleModal>
        </div>
      )
    },
  }),
]
