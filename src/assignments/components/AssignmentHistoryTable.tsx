import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { ExtendedAssignmentStatusLog } from "../hooks/useAssignmentData"
import { JsonFormModal } from "src/core/components/JsonFormModal"
import { ProcessedAssignmentHistory } from "../utils/processAssignments"

// Column helper
const columnHelper = createColumnHelper<ProcessedAssignmentHistory>()

// ColumnDefs
export const assignmentHistoryTableColumns: ColumnDef<ProcessedAssignmentHistory>[] = [
  columnHelper.accessor("contributorName", {
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
            schema={info.getValue()?.schema}
            uiSchema={info.getValue()?.ui}
            label="View Form Data"
          />
        ) : (
          <span>No metadata provided</span>
        )}
      </>
    ),
    header: "Form Data",
  }),
]

export const assignmentHistoryTableColumnsNoMeta: ColumnDef<ProcessedAssignmentHistory>[] = [
  columnHelper.accessor("contributorName", {
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
