import React from "react"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { TaskLogToggleModal } from "./TaskLogToggleModal"
import { ProcessedIndividualTaskLog } from "../utils/processTaskLogs"
import { TaskLogSchemaModal } from "./TaskLogSchemaModal"

// Column helper
const columnHelper = createColumnHelper<ProcessedIndividualTaskLog>()

// ColumnDefs
// Table for assignment without a form
export const taskLogTableColumns: ColumnDef<ProcessedIndividualTaskLog>[] = [
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
    cell: (info) => {
      return (
        <>
          <TaskLogToggleModal taskLog={info.getValue()} />
        </>
      )
    },
    header: "Change status",
    id: "updateStatus",
  }),
]

// Table for assignment with a form
export const taskLogTableColumnsSchema: ColumnDef<ProcessedIndividualTaskLog>[] = [
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
