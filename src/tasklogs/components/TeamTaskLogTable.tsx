import React from "react"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { TaskLogToggleModal } from "./TaskLogToggleModal"
import { ShowTeamModal } from "./ShowTeamModal"
import { ProcessedTeamTaskLog } from "../utils/processTaskLogs"
import { TaskLogSchemaModal } from "./TaskLogSchemaModal"

// Column helper
const columnHelper = createColumnHelper<ProcessedTeamTaskLog>()

// ColumnDefs
export const teamTaskLogTableColumns: ColumnDef<ProcessedTeamTaskLog>[] = [
  columnHelper.accessor("projectMember", {
    cell: (info) => {
      const rowData = info.row.original // Access the entire row data
      return (
        <div>
          <ShowTeamModal projectMember={rowData}></ShowTeamModal>
        </div>
      )
    },
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
    cell: (info) => {
      return (
        <div>
          <TaskLogToggleModal taskLog={info.getValue()} />
        </div>
      )
    },
    header: "Change status",
    id: "updateStatus",
  }),
]

export const teamTaskLogTableColumnsSchema: ColumnDef<ProcessedTeamTaskLog>[] = [
  columnHelper.accessor("projectMember", {
    cell: (info) => <div>{<ShowTeamModal projectMember={info.getValue()}></ShowTeamModal>}</div>,
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
    cell: (info) => {
      return (
        <>
          <TaskLogSchemaModal taskLog={info.getValue()} />
        </>
      )
    },
    header: "Form Data",
  }),
]
