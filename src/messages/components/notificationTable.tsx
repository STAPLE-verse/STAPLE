import { Notification } from "db"
import { createColumnHelper } from "@tanstack/react-table"

// Column helper
const columnHelper = createColumnHelper<Notification>()

// ColumnDefs
export const notificationTableColumns = [
  columnHelper.accessor("createdAt", {
    cell: (info) => <span>{info.getValue().toString()}</span>,
    header: "Date",
  }),
  columnHelper.accessor("read", {
    cell: (info) => <span>{info.getValue().toString()} </span>,
    header: "Read",
  }),
  columnHelper.accessor("message", {
    id: "message",
    header: "",
    cell: (info) => info.getValue(),
  }),
]
