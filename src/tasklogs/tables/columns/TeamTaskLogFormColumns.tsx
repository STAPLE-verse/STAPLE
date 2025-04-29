import React from "react"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { ProcessedTeamTaskLog } from "../processing/processTaskLogs"
import { TaskLogSchemaModal } from "../../components/TaskLogSchemaModal"
import { ShowTeamModal } from "src/teams/components/ShowTeamModal"
import ToggleModal from "src/core/components/ToggleModal"
import ChatBox from "src/comments/components/ChatBox"

// Column helper
const columnHelper = createColumnHelper<ProcessedTeamTaskLog>()

// ColumnDefs
export const TeamTaskLogFormColumns: ColumnDef<ProcessedTeamTaskLog>[] = [
  columnHelper.accessor("teamId", {
    cell: (info) => (
      <ShowTeamModal teamId={info.getValue()} disabled={info.row.original.deletedTeam} />
    ),
    header: "Team Name",
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
    cell: (info) => <TaskLogSchemaModal taskLog={info.getValue()} />,
    header: "Form Data",
  }),
  columnHelper.accessor("firstLogId", {
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <ToggleModal
        buttonLabel={"Open"}
        modalTitle={
          <div className="flex items-center">
            <span>Comments:</span>
            <span className="italic ml-1">{info.row.original.taskName}</span>
          </div>
        }
        buttonClassName="w-2/3"
      >
        <ChatBox taskLogId={info.getValue()!} initialComments={info.row.original.comments} />
      </ToggleModal>
    ),
    header: "Comments",
    id: "chat",
  }),
]
