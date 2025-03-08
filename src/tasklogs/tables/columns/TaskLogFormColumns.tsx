import React from "react"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { ProcessedIndividualTaskLog } from "../processing/processTaskLogs"
import { TaskLogSchemaModal } from "../../components/TaskLogSchemaModal"
import ToggleModal from "src/core/components/ToggleModal"
import ChatBox from "src/comments/components/ChatBox"

// Column helper
const columnHelper = createColumnHelper<ProcessedIndividualTaskLog>()

// ColumnDefs
// Table for assignment with a form
export const TaskLogFormColumns: ColumnDef<ProcessedIndividualTaskLog>[] = [
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
    cell: (info) => <TaskLogSchemaModal taskLog={info.getValue()} />,
    header: "Form Data",
  }),
  columnHelper.accessor("firstLogId", {
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <ToggleModal buttonLabel={"Open"} modalTitle={"Task comments"}>
        <ChatBox taskLogId={info.getValue()!} initialComments={info.row.original.comments} />
      </ToggleModal>
    ),
    header: "Comments",
    id: "chat",
  }),
]
