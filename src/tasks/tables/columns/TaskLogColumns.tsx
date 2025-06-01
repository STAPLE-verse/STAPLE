import React from "react"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import {
  InformationCircleIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  HandRaisedIcon,
} from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import ChatBox from "src/comments/components/ChatBox"
import ToggleModal from "src/core/components/ToggleModal"
import { ShowTeamModal } from "src/teams/components/ShowTeamModal"
import { getContributorName } from "src/core/utils/getName"
import { TaskLogwithComments } from "src/tasks/components/TaskLogTable"
import DateFormat from "src/core/components/DateFormat"

const columnHelper = createColumnHelper<TaskLogwithComments>()
export const taskLogColumns: ColumnDef<TaskLogwithComments>[] = [
  columnHelper.accessor("completedAs", {
    cell: (info) => <span>{info.getValue() === "TEAM" ? "Team" : "Individual"}</span>,
    header: "Type",
    id: "type",
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      filterVariant: "select",
    },
  }),
  columnHelper.display({
    id: "projectMemberName",
    header: "Collaborator(s)",
    cell: (info) => {
      const { completedAs, assignedTo, assignedToId } = info.row.original
      if (completedAs === "INDIVIDUAL") {
        return (
          <>
            <Link
              className="btn btn-primary w-2/3"
              data-tooltip-id="showIndividualModalTooltip"
              href={Routes.ShowContributorPage({
                projectId: info.row.original.projectId,
                contributorId: assignedToId,
              })}
            >
              {getContributorName(assignedTo)}
            </Link>
            <Tooltip
              id="showIndividualModalTooltip"
              content="Go to contributor page"
              className="z-[1099] ourtooltips"
            />
          </>
        )
      } else {
        return <ShowTeamModal teamId={assignedToId} disabled={false} />
      }
    },
  }),
  columnHelper.accessor("createdAt", {
    cell: (info) => {
      const isOverdue = info.row.original.overdue
      return (
        <div className="flex items-center gap-1">
          {isOverdue && (
            <span className="text-error" title="Overdue">
              <HandRaisedIcon className="h-5 w-5 inline-block" />
            </span>
          )}
          <span>
            <DateFormat date={info.getValue()} />
          </span>
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
  columnHelper.accessor("statusText", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Status",
    id: "statusText",
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      filterVariant: "select",
    },
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
              refetchComments={info.row.original.refetch}
            />
          </ToggleModal>
        </div>
      )
    },
    header: "Comments",
    id: "chat",
  }),
]
