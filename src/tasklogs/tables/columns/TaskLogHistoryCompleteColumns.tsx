import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { ApproveDropdown } from "src/tasklogs/components/ApproveTask"
import { ProcessedTaskLogHistoryModal } from "../processing/processTaskLogs"

// Column helper
const columnHelper = createColumnHelper<ProcessedTaskLogHistoryModal>()

// ColumnDefs
export const TaskLogHistoryCompleteColumns: ColumnDef<ProcessedTaskLogHistoryModal>[] = [
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
    cell: (info) => {
      const privilege = info.row.original.privilege
      const value = info.getValue()
      const displayValue = value === null ? "Pending" : value === true ? "Approved" : "Not Approved"
      return privilege === "CONTRIBUTOR" ? (
        <span>{displayValue}</span>
      ) : (
        <ApproveDropdown
          value={value}
          onChange={(newValue) => {}}
          taskLogId={info.row.original.id}
        />
      )
    },
    header: "Approved",
    id: "approved",
  }),
]
