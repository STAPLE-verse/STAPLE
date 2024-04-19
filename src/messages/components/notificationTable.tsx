import { Notification } from "db"
import { createColumnHelper } from "@tanstack/react-table"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"

// Column helper
const columnHelper = createColumnHelper<Notification>()

// ColumnDefs
export const notificationTableColumns = [
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
    cell: (info) => (
      <span>
        {info.getValue() ? <EyeIcon className="h-8 w-8" /> : <EyeSlashIcon className="h-8 w-8" />}
      </span>
    ),
    header: "",
  }),
]
