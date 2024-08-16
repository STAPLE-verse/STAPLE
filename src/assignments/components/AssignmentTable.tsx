import React from "react"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { AssignmentToggleModal } from "./AssignmentToggleModal"
import { ProcessedIndividualAssignment } from "../utils/processAssignments"
import { AssignmentSchemaModal } from "./AssignmentSchemaModal"

// Column helper
const columnHelper = createColumnHelper<ProcessedIndividualAssignment>()

// ColumnDefs
// Table for assignment without a form
export const assignmentTableColumns: ColumnDef<ProcessedIndividualAssignment>[] = [
  columnHelper.accessor("contributorName", {
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
  columnHelper.accessor("assignment", {
    cell: (info) => {
      return (
        <>
          <AssignmentToggleModal assignment={info.getValue()} />
        </>
      )
    },
    header: "Change status",
    id: "updateStatus",
  }),
]

// Table for assignment with a form
export const assignmentTableColumnsSchema: ColumnDef<ProcessedIndividualAssignment>[] = [
  columnHelper.accessor("contributorName", {
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
  columnHelper.accessor("assignment", {
    cell: (info) => {
      return (
        <>
          <AssignmentSchemaModal assignment={info.getValue()} />
        </>
      )
    },
    header: "Form Data",
  }),
]
