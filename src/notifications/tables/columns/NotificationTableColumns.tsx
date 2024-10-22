import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import DateFormat from "src/core/components/DateFormat"
import ReadToggle from "src/notifications/components/ReadToggle"
import { NotificationTableData } from "../processing/processNotificationTableData"
import HtmlFormat from "src/core/components/HtmlFormat"

// Column helper
const columnHelper = createColumnHelper<NotificationTableData>()

// ColumnDefs
export const useNotificationTableColumns = (refetch: () => void) => {
  return useMemo(
    () => [
      columnHelper.accessor("createdAt", {
        cell: (info) => <DateFormat date={info.getValue()}></DateFormat>,
        header: "Date",
      }),
      columnHelper.accessor("projectName", {
        header: "Project",
        enableColumnFilter: true,
        enableSorting: true,
        cell: (info) => <span>{info.getValue()}</span>,
      }),
      columnHelper.accessor("cleanMessage", {
        id: "message",
        header: "Notification Message",
        enableColumnFilter: true,
        enableSorting: true,
        cell: (info) => <HtmlFormat html={info.row.original.rawMessage} />,
        meta: {
          filterVariant: "text",
          isHtml: true,
        },
      }),
      columnHelper.accessor("notification", {
        enableColumnFilter: false,
        //enableSorting: false,
        cell: (info) => <ReadToggle notification={info.getValue()} refetch={refetch} />,
        header: "Read",
      }),
    ],
    [refetch]
  )
}
