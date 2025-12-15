import React from "react"
import { ColumnDef, FilterFn, createColumnHelper } from "@tanstack/react-table"
import { ProcessedIndividualTaskLog } from "../processing/processTaskLogs"
import { ProcessedTeamTaskLog } from "../processing/processTaskLogs"
import ToggleModal from "src/core/components/ToggleModal"
import ChatBox from "src/comments/components/ChatBox"

import {
  ChatBubbleOvalLeftEllipsisIcon,
  HandRaisedIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline"
import DateFormat from "src/core/components/DateFormat"
import { CheckCircleIcon, XCircleIcon, ClockIcon } from "@heroicons/react/24/outline"
import { TaskLogTaskCompleted } from "src/core/types"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import TaskLogHistoryModal from "src/tasklogs/components/TaskLogHistoryModal"
import { Tooltip } from "react-tooltip"
import { TaskLogSchemaModal } from "src/tasklogs/components/TaskLogSchemaModal"
import { TaskLogToggleModal } from "src/tasklogs/components/TaskLogToggleModal"
import { createDateTextFilter } from "src/core/utils/tableFilters"

type ProcessedTaskLog = (ProcessedIndividualTaskLog | ProcessedTeamTaskLog) & {
  refetchTaskData?: () => Promise<void>
}

const lastUpdateFilter = createDateTextFilter({ emptyLabel: "no date" })
// Column helper
const columnHelper = createColumnHelper<ProcessedTaskLog>()

const statusFilter: FilterFn<ProcessedTaskLog> = (row, columnId, filterValue) => {
  const selected = String(filterValue ?? "")
    .trim()
    .toLowerCase()

  if (!selected) {
    return true
  }

  const value = String(row.getValue(columnId) ?? "")
    .trim()
    .toLowerCase()

  return value === selected
}

const approvalFilter: FilterFn<ProcessedTaskLog> = (row, columnId, filterValue) => {
  const selected = String(filterValue ?? "")
    .trim()
    .toLowerCase()

  if (!selected) {
    return true
  }

  const value = row.getValue<boolean | null>(columnId)

  if (selected === "approved") {
    return value === true
  }

  if (selected === "not approved") {
    return value === false
  }

  if (selected === "pending") {
    return value === null
  }

  return true
}

// ColumnDefs
// Table for assignment with a form
export const TaskLogProjectMemberColumns: ColumnDef<ProcessedTaskLog>[] = [
  columnHelper.accessor("taskName", {
    cell: (info) => {
      const name = info.getValue()
      const taskLog = info.row.original.taskLog as TaskLogTaskCompleted
      const taskId = taskLog.task.id
      const projectId = taskLog.task.projectId
      const displayName = name.length > 20 ? `${name.slice(0, 20)}...` : name
      return (
        <Link href={Routes.ShowTaskPage({ taskId, projectId })}>
          <button className="btn btn-primary w-full ">{displayName}</button>
        </Link>
      )
    },
    header: "Task",
    id: "task",
  }),
  columnHelper.accessor("lastUpdate", {
    cell: (info) => {
      const isOverdue = info.row.original.overdue
      return (
        <div className="flex gap-1">
          {isOverdue && (
            <span className="text-error" title="Overdue">
              <HandRaisedIcon className="h-5 w-5 inline-block" />
            </span>
          )}
          <DateFormat date={info.getValue()} preset="date" />
        </div>
      )
    },
    header: (
      <div className="table-header-tooltip">
        Latest Update
        <InformationCircleIcon
          className="ml-1 h-4 w-4 stroke-2 text-info"
          data-tooltip-id="update-tooltip"
        />
        <Tooltip
          id="update-tooltip"
          content="The last update on this task from you or the project member. The hand icon indicates updates after the due date."
          className="z-[1099] ourtooltips"
        />
      </div>
    ),
    id: "updatedAt",
    enableColumnFilter: true,
    enableSorting: true,
    filterFn: lastUpdateFilter,
    meta: {
      filterVariant: "text",
    },
  }),
  columnHelper.accessor("status", {
    cell: (info) => {
      const value = info.getValue()
      const isCompleted = value === "Completed"
      return (
        <div className="flex">
          {isCompleted ? (
            <CheckCircleIcon className="h-6 w-6 text-success" title="Completed" />
          ) : (
            <XCircleIcon className="h-6 w-6 text-error" title="Not Completed" />
          )}
        </div>
      )
    },
    header: "Status",
    id: "status",
    enableColumnFilter: true,
    enableSorting: true,
    filterFn: statusFilter,
    meta: {
      filterVariant: "select",
      selectOptions: [
        { label: "Completed", value: "completed" },
        { label: "Not completed", value: "not completed" },
      ],
    },
  }),
  columnHelper.accessor("approved", {
    cell: (info) => {
      const value = info.getValue() as boolean | null
      return (
        <div className="flex">
          {value === true ? (
            <CheckCircleIcon className="h-6 w-6 text-success" title="Approved" />
          ) : value === false ? (
            <XCircleIcon className="h-6 w-6 text-error" title="Not Approved" />
          ) : (
            <ClockIcon className="h-6 w-6 text-warning" title="Pending" />
          )}
        </div>
      )
    },
    header: "Approved",
    id: "approved",
    enableColumnFilter: true,
    enableSorting: true,
    filterFn: approvalFilter,
    meta: {
      filterVariant: "select",
      selectOptions: [
        { label: "Approved", value: "approved" },
        { label: "Pending", value: "pending" },
        { label: "Not approved", value: "not approved" },
      ],
    },
  }),
  columnHelper.accessor("taskHistory", {
    cell: (info) => {
      const { taskHistory, schema, ui, refetchTaskData } = info.row.original

      return (
        <TaskLogHistoryModal
          taskLogs={taskHistory ?? []}
          {...(schema && ui ? { schema, ui } : {})}
          refetchTaskData={refetchTaskData}
          privilege={info.row.original.privilege}
        />
      )
    },
    header: "History",
    id: "history",
    enableColumnFilter: false,
    enableSorting: false,
  }),
  columnHelper.accessor("taskLog", {
    cell: (info) => {
      const { schema, refetchTaskData } = info.row.original
      const taskLog = info.getValue()
      return schema ? (
        <TaskLogSchemaModal taskLog={taskLog} refetchTaskData={refetchTaskData} />
      ) : (
        <TaskLogToggleModal taskLog={taskLog} refetchTaskData={refetchTaskData} />
      )
    },
    header: "Responses",
    enableColumnFilter: false,
  }),
  columnHelper.accessor("firstLogId", {
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => {
      const hasNewComments = (info.row.original.newCommentsCount ?? 0) > 0
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
                <span className="italic ml-1">{info.row.original.taskName}</span>
              </>
            }
            buttonClassName="btn-ghost"
          >
            <ChatBox
              taskLogId={info.getValue()!}
              initialComments={info.row.original.comments}
              refetchComments={info.row.original.refetchComments}
            />
          </ToggleModal>
        </div>
      )
    },
    header: "Comments",
    id: "chat",
  }),
]
