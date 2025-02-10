import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import DateFormat from "src/core/components/DateFormat"
import HtmlFormat from "src/notifications/components/HtmlFormat"
import ReadToggle from "src/notifications/components/ReadToggle"
import { ProjectNotificationData } from "../processing/processProjectNotification"

// Column helper
const columnHelper = createColumnHelper<ProjectNotificationData>()

// ColumnDefs
export const useProjectNotificationTableColumns = (refetch: () => void) => {
  return useMemo(
    () => [
      columnHelper.accessor("createdAt", {
        cell: (info) => <DateFormat date={info.getValue()} />,
        header: "Date",
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
        enableSorting: false,
        cell: (info) => <ReadToggle notification={info.getValue()} refetch={refetch} />,
        header: "Read",
      }),
    ],
    [refetch]
  )
}
