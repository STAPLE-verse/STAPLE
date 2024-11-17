import React from "react"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { TaskLogToggleModal } from "../../components/TaskLogToggleModal"
import { ProcessedIndividualTaskLog } from "../processing/processTaskLogs"

// Column helper
const columnHelper = createColumnHelper<ProcessedIndividualTaskLog>()

// ColumnDefs
// Table for assignment without a form
export const TaskLogCompleteColumns: ColumnDef<ProcessedIndividualTaskLog>[] = [
  columnHelper.accessor("projectMemberName", {
    cell: (info) => <span>{`${info.getValue()}`}</span>,
    header: "Contributor Name",
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
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <TaskLogToggleModal taskLog={info.getValue()} />,
    header: "Change status",
    id: "updateStatus",
  }),
]
