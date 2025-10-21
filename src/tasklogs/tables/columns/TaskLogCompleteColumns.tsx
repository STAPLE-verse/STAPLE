import React from "react"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { TaskLogToggleModal } from "../../components/TaskLogToggleModal"
import { ProcessedIndividualTaskLog, ProcessedTeamTaskLog } from "../processing/processTaskLogs"
import ToggleModal from "src/core/components/ToggleModal"
import ChatBox from "src/comments/components/ChatBox"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { Tooltip } from "react-tooltip"
import { ShowTeamModal } from "src/teams/components/ShowTeamModal"
import {
  ChatBubbleOvalLeftEllipsisIcon,
  HandRaisedIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline"
import TaskLogHistoryModal from "src/tasklogs/components/TaskLogHistoryModal"
import DateFormat from "src/core/components/DateFormat"

// Column helper
const columnHelper = createColumnHelper<ProcessedIndividualTaskLog | ProcessedTeamTaskLog>()

// ColumnDefs
// Table for assignment without a form
export const TaskLogCompleteColumns: ColumnDef<
  ProcessedIndividualTaskLog | ProcessedTeamTaskLog
>[] = [
  columnHelper.accessor("type", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Type",
    id: "type",
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      filterVariant: "select",
    },
  }),
  columnHelper.accessor("projectMemberName", {
    id: "contributorOrTeam",
    header: "Collaborator(s)",
    cell: (info) => {
      const { type, teamId, deletedTeam } = info.row.original
      const projectId =
        type === "Individual" ? (info.row.original as ProcessedIndividualTaskLog).projectId : ""
      const contributorId =
        type === "Individual" ? (info.row.original as ProcessedIndividualTaskLog).contributorId : ""
      if (type === "Individual") {
        return (
          <>
            <Link
              className="btn btn-primary w-full"
              data-tooltip-id="showIndividualModalTooltip"
              href={Routes.ShowContributorPage({
                projectId: projectId,
                contributorId: contributorId,
              })}
            >
              {info.getValue()}
            </Link>
            <Tooltip
              id="showIndividualModalTooltip"
              content="Go to contributor page"
              className="z-[1099] ourtooltips"
            />
          </>
        )
      } else {
        return <ShowTeamModal teamId={teamId} disabled={deletedTeam} />
      }
    },
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
          <DateFormat date={info.getValue()} preset="dateShort" />
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
    cell: (info) => {
      const value = info.getValue()
      const isCompleted = value === "Completed"
      return (
        <div className="flex justify-center items-center">
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
    meta: {
      filterVariant: "select",
    },
  }),
  columnHelper.accessor("approved", {
    cell: (info) => {
      const value = info.getValue() as boolean | null
      let icon: JSX.Element
      if (value === true) {
        icon = <CheckCircleIcon className="h-6 w-6 text-success" title="Approved" />
      } else if (value === false) {
        icon = <XCircleIcon className="h-6 w-6 text-error" title="Not approved" />
      } else {
        icon = <ClockIcon className="h-6 w-6 text-warning" title="Pending" />
      }
      return <div className="flex justify-center items-center">{icon}</div>
    },
    header: "Approved",
    id: "approved",
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      filterVariant: "select",
    },
  }),
  columnHelper.accessor("taskHistory", {
    cell: (info) => {
      return (
        <TaskLogHistoryModal
          taskLogs={info.row.original.taskHistory ?? []}
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
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <TaskLogToggleModal taskLog={info.getValue()} />,
    header: "Change Status",
    id: "updateStatus",
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
