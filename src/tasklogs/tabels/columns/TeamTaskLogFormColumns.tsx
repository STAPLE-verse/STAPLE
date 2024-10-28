import React from "react"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { ProcessedTeamTaskLog } from "../processing/processTaskLogs"
import { TaskLogSchemaModal } from "../../components/TaskLogSchemaModal"
import { ShowTeamModal } from "src/teams/components/ShowTeamModal"

// Column helper
const columnHelper = createColumnHelper<ProcessedTeamTaskLog>()

// ColumnDefs
export const TeamTaskLogFormColumns: ColumnDef<ProcessedTeamTaskLog>[] = [
  columnHelper.accessor("projectMember", {
    cell: (info) => <div>{<ShowTeamModal projectMember={info.getValue()}></ShowTeamModal>}</div>,
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