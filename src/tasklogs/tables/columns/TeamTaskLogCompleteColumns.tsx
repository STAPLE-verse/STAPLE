import React from "react"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { TaskLogToggleModal } from "../../components/TaskLogToggleModal"
import { ProcessedTeamTaskLog } from "../processing/processTaskLogs"
import { ShowTeamModal } from "src/teams/components/ShowTeamModal"
import ToggleModal from "src/core/components/ToggleModal"
import ChatBox from "src/comments/components/ChatBox"

// Column helper
const columnHelper = createColumnHelper<ProcessedTeamTaskLog>()

// ColumnDefs
export const TeamTaskLogCompleteColumns: ColumnDef<ProcessedTeamTaskLog>[] = [
  columnHelper.accessor("projectMember", {
    cell: (info) => (
      <ShowTeamModal projectMember={info.getValue()} disabled={info.getValue().deleted} />
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
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <TaskLogToggleModal taskLog={info.getValue()} />,
    header: "Change status",
    id: "updateStatus",
  }),
  columnHelper.accessor("firstLogId", {
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <ToggleModal buttonLabel={"Open"} modalTitle={"Team Task Comments"}>
        <ChatBox taskLogId={info.getValue()!} initialComments={info.row.original.comments} />
      </ToggleModal>
    ),
    header: "Comments",
    id: "chat",
  }),
]
