import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { JsonFormModal } from "src/core/components/JsonFormModal"
import { ProcessedTaskLogHistoryModal } from "../processing/processTaskLogs"
import { ApproveDropdown } from "src/tasklogs/components/ApproveTask"
import DateFormat from "src/core/components/DateFormat"
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline"
// Column helper
const columnHelper = createColumnHelper<ProcessedTaskLogHistoryModal>()

// ColumnDefs
export const TaskLogHistoryFormColumns: ColumnDef<ProcessedTaskLogHistoryModal>[] = [
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
      return privilege === "CONTRIBUTOR" ? (
        <span>{value === null ? "Pending" : value === true ? "Approved" : "Not Approved"}</span>
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
  columnHelper.accessor("formData", {
    cell: (info) => (
      <>
        {info.row.original ? (
          <JsonFormModal
            metadata={info.getValue()?.metadata}
            schema={info.getValue()!.schema}
            uiSchema={info.getValue()!.ui}
            label="View Response"
            classNames="btn-primary"
            submittable={false}
          />
        ) : (
          <span>No metadata provided</span>
        )}
      </>
    ),
    header: "Response",
  }),
]
