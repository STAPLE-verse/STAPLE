import { Notification } from "db"
import { createColumnHelper } from "@tanstack/react-table"
import ReadToggle from "./ReadToggle"

// Column helper
const columnHelper = createColumnHelper<Notification>()

// ColumnDefs
export const notificationTableColumns = (refetch) => [
  columnHelper.accessor("createdAt", {
    cell: (info) => (
      <span>
        {info.getValue()?.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false, // Use 24-hour format
        })}
      </span>
    ),
    header: "Date",
  }),
  columnHelper.accessor("message", {
    id: "message",
    header: "Notification Message",
    //enableColumnFilter: false,
    //enableSorting: false,
    cell: (info) => <div dangerouslySetInnerHTML={{ __html: info.getValue() }} />,
  }),
  columnHelper.accessor("read", {
    enableColumnFilter: false,
    //enableSorting: false,
    cell: (info) => <ReadToggle notification={info.row.original} refetch={refetch} />,
    header: "Read",
  }),
]
