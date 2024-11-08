import React from "react"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { ProcessedTeamTaskLog } from "../processing/processTaskLogs"
import { TaskLogSchemaModal } from "../../components/TaskLogSchemaModal"
import { ShowTeamModal } from "src/teams/components/ShowTeamModal"

// Column helper
const columnHelper = createColumnHelper<ProcessedTeamTaskLog>()

// ColumnDefs
export const TeamTaskLogFormColumns: ColumnDef<ProcessedTeamTaskLog>[] = [
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
    cell: (info) => <TaskLogSchemaModal taskLog={info.getValue()} />,
    header: "Form Data",
  }),
]
