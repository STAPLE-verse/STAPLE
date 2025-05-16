import React from "react"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { ProcessedIndividualTaskLog } from "../processing/processTaskLogs"
import { TaskLogSchemaModal } from "../../components/TaskLogSchemaModal"
import ToggleModal from "src/core/components/ToggleModal"
import ChatBox from "src/comments/components/ChatBox"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { ShowTeamModal } from "src/teams/components/ShowTeamModal"
import TooltipWrapper from "src/core/components/TooltipWrapper"
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline"

// Column helper
const columnHelper = createColumnHelper<ProcessedIndividualTaskLog>()

// ColumnDefs
// Table for assignment with a form
export const TaskLogFormColumns: ColumnDef<ProcessedIndividualTaskLog>[] = [
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
      const { type, projectId, contributorId, teamId, deletedTeam } = info.row.original
      if (type === "Individual") {
        return (
          <>
            <Link
              className="btn btn-primary w-2/3"
              data-tooltip-id="showIndividualModalTooltip"
              href={Routes.ShowContributorPage({
                projectId: projectId,
                contributorId: contributorId,
              })}
            >
              {info.getValue()}
            </Link>
            <TooltipWrapper
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
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Last Update",
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
  columnHelper.accessor("taskLog", {
    cell: (info) => <TaskLogSchemaModal taskLog={info.getValue()} />,
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
            <ChatBox taskLogId={info.getValue()!} initialComments={info.row.original.comments} />
          </ToggleModal>
        </div>
      )
    },
    header: "Comments",
    id: "chat",
  }),
]
