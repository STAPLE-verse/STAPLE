import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { JsonFormModal } from "src/core/components/JsonFormModal"
import { ProcessedTaskLogHistory } from "../utils/processTaskLogs"
import { noSubmitButton } from "src/forms/utils/extendSchema"

// Column helper
const columnHelper = createColumnHelper<ProcessedTaskLogHistory>()

// ColumnDefs
export const taskLogHistoryTableColumns: ColumnDef<ProcessedTaskLogHistory>[] = [
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
  columnHelper.accessor("formData", {
    cell: (info) => (
      <>
        {info.row.original ? (
          <JsonFormModal
            metadata={info.getValue()?.metadata}
            schema={info.getValue()!.schema}
            uiSchema={noSubmitButton(info.getValue()!.ui)}
            label="View Form Data"
            classNames="btn-primary"
          />
        ) : (
          <span>No metadata provided</span>
        )}
      </>
    ),
    header: "Form Data",
  }),
]

export const taskLogHistoryTableColumnsNoMeta: ColumnDef<ProcessedTaskLogHistory>[] = [
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
]
