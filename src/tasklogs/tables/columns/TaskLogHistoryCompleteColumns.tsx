import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { ProcessedTaskLogHistory } from "../processing/processTaskLogs"

// Column helper
const columnHelper = createColumnHelper<ProcessedTaskLogHistory>()

// ColumnDefs
export const TaskLogHistoryCompleteColumns: ColumnDef<ProcessedTaskLogHistory>[] = [
  columnHelper.accessor("projectMemberName", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Changed By",
    id: "changedBy",
  }),
  columnHelper.accessor("lastUpdate", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Last Update",
    id: "createdAt",
  }),
  columnHelper.accessor("status", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Status",
    id: "status",
  }),
  columnHelper.accessor("approved", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Approved",
    id: "approved",
  }),
]
