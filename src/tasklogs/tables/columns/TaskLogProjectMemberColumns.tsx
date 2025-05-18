import React from "react"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { ProcessedIndividualTaskLog } from "../processing/processTaskLogs"
import { ProcessedTeamTaskLog } from "../processing/processTaskLogs"
import { TaskLogSchemaModal } from "../../components/TaskLogSchemaModal"
import ToggleModal from "src/core/components/ToggleModal"
import ChatBox from "src/comments/components/ChatBox"

import {
  ChatBubbleOvalLeftEllipsisIcon,
  DocumentTextIcon,
  HandRaisedIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline"
import TaskLogHistoryModal from "src/tasklogs/components/TaskLogHistoryModal"
import { Tooltip } from "react-tooltip"
import { TaskLogToggleModal } from "src/tasklogs/components/TaskLogToggleModal"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { TaskLogTaskCompleted } from "src/core/types"

type ProcessedTaskLog = ProcessedIndividualTaskLog | ProcessedTeamTaskLog
// Column helper
const columnHelper = createColumnHelper<ProcessedTaskLog>()

// ColumnDefs
// Table for assignment with a form
export const TaskLogProjectMemberColumns: ColumnDef<ProcessedTaskLog>[] = [
  columnHelper.accessor("taskName", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Task",
    id: "task",
  }),
  columnHelper.accessor("lastUpdate", {
    cell: (info) => {
      const isOverdue = info.row.original.overdue
      return (
        <div className="flex items-center gap-1">
          {isOverdue && (
            <span className="text-error" title="Overdue">
              <HandRaisedIcon className="h-5 w-5 inline-block" />
            </span>
          )}
          <span>{info.getValue()}</span>
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
  }),
  columnHelper.accessor("status", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Status",
    id: "status",
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      filterVariant: "select",
    },
  }),
  columnHelper.accessor("taskHistory", {
    cell: (info) => {
      const { taskHistory, schema, ui } = info.row.original
      return (
        <TaskLogHistoryModal
          taskLogs={taskHistory ?? []}
          {...(schema && ui ? { schema, ui } : {})}
        />
      )
    },
    header: "History",
    id: "history",
    enableColumnFilter: false,
    enableSorting: false,
  }),
  columnHelper.accessor("taskLog", {
    id: "view",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => {
      const taskLog = info.getValue() as TaskLogTaskCompleted
      return (
        <Link
          className="btn btn-ghost"
          href={Routes.TaskLogsPage({
            taskId: taskLog.task.id,
            projectId: taskLog.task.projectId,
          })}
        >
          <DocumentTextIcon width={25} className="stroke-primary" />
        </Link>
      )
    },
    header: "Responses",
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
                  <div className="flex items-center justify-center absolute -top-1 -right-1 h-4 w-4 rounded-full bg-error text-xs text-white">
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
