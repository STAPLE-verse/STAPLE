import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { JsonFormModal } from "src/core/components/JsonFormModal"
import { ProcessedTaskLogHistoryModal } from "../processing/processTaskLogs"
import { ApproveDropdown } from "src/tasklogs/components/ApproveTask"
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
      return privilege === "CONTRIBUTOR" ? (
        <span>{value}</span>
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
