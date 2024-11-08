import React from "react"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { TaskLogToggleModal } from "../../components/TaskLogToggleModal"
import { ProcessedTeamTaskLog } from "../processing/processTaskLogs"
import { ShowTeamModal } from "src/teams/components/ShowTeamModal"

// Column helper
const columnHelper = createColumnHelper<ProcessedTeamTaskLog>()

// ColumnDefs
export const TeamTaskLogCompleteColumns: ColumnDef<ProcessedTeamTaskLog>[] = [
  columnHelper.accessor("projectMember", {
    cell: (info) => <ShowTeamModal projectMember={info.getValue()} />,
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
    cell: (info) => <TaskLogToggleModal taskLog={info.getValue()} />,
    header: "Change status",
    id: "updateStatus",
  }),
]
