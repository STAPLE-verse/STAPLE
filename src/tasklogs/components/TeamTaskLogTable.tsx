import React from "react"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { AssignmentToggleModal } from "./TaskLogToggleModal"
import { ShowTeamModal } from "./ShowTeamModal"
import { ProcessedTeamAssignment } from "../utils/processTaskLogs"
import { AssignmentSchemaModal } from "./TaskLogSchemaModal"

// Column helper
const columnHelper = createColumnHelper<ProcessedTeamAssignment>()

// ColumnDefs
export const teamAssignmentTableColumns: ColumnDef<ProcessedTeamAssignment>[] = [
  columnHelper.accessor("team", {
    cell: (info) => <div>{<ShowTeamModal team={info.getValue()}></ShowTeamModal>}</div>,
    header: "Team Name",
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
        <div>
          <AssignmentToggleModal assignment={info.getValue()} />
        </div>
      )
    },
    header: "Change status",
    id: "updateStatus",
  }),
]

export const teamAssignmentTableColumnsSchema: ColumnDef<ProcessedTeamAssignment>[] = [
  columnHelper.accessor("team", {
    cell: (info) => <div>{<ShowTeamModal team={info.getValue()}></ShowTeamModal>}</div>,
    header: "Team Name",
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
