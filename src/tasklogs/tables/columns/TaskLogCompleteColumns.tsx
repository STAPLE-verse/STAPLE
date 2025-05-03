import React from "react"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { TaskLogToggleModal } from "../../components/TaskLogToggleModal"
import { ProcessedIndividualTaskLog } from "../processing/processTaskLogs"
import ToggleModal from "src/core/components/ToggleModal"
import ChatBox from "src/comments/components/ChatBox"
import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { Tooltip } from "react-tooltip"
import { ShowTeamModal } from "src/teams/components/ShowTeamModal"

// Column helper
const columnHelper = createColumnHelper<ProcessedIndividualTaskLog>()

// ColumnDefs
// Table for assignment without a form
export const TaskLogCompleteColumns: ColumnDef<ProcessedIndividualTaskLog>[] = [
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
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Last Update",
    id: "updatedAt",
  }),
  columnHelper.accessor("status", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Status",
    id: "status",
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
    cell: (info) => (
      <ToggleModal
        buttonLabel={"Open"}
        modalTitle={
          <>
            <span>Comments:</span>
            <span className="italic ml-1">{info.row.original.taskName}</span>
          </>
        }
      >
        <ChatBox taskLogId={info.getValue()!} initialComments={info.row.original.comments} />
      </ToggleModal>
    ),
    header: "Comments",
    id: "chat",
  }),
]
