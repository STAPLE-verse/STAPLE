import DateFormat from "src/core/components/DateFormat"
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline"
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
    cell: (info) => <DateFormat date={info.getValue()} preset="full" />,
    header: "Last Update",
    id: "createdAt",
  }),
  columnHelper.accessor("status", {
    cell: (info) => {
      const value = info.getValue()
      const isCompleted = value === "Completed"
      return (
        <div className="flex justify-center items-center">
          {isCompleted ? (
            <CheckCircleIcon className="h-6 w-6 text-success" title="Completed" />
          ) : (
            <XCircleIcon className="h-6 w-6 text-error" title="Not Completed" />
          )}
        </div>
      )
    },
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
