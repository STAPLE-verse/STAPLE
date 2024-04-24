import { Notification } from "db"
import { createColumnHelper } from "@tanstack/react-table"
import ReadToggle from "./ReadToggle"

// Column helper
const columnHelper = createColumnHelper<Notification>()

// ColumnDefs
export const notificationTableColumns = (refetch) => [
  columnHelper.accessor("createdAt", {
    cell: (info) => <span>{info.getValue().toString()}</span>,
    header: "Date",
  }),
  columnHelper.accessor("message", {
    id: "message",
    header: "",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <div dangerouslySetInnerHTML={{ __html: info.getValue() }} />,
  }),
  columnHelper.accessor("read", {
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <ReadToggle notification={info.row.original} refetch={refetch} />,
    header: "",
  }),
]
