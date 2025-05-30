import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import DateFormat from "src/core/components/DateFormat"
import ReadToggle from "src/notifications/components/ReadToggle"
import { NotificationTableData } from "../processing/processNotification"
import NotificationMessage from "src/notifications/components/NotificationMessage"
import { MultiSelectCheckbox } from "src/core/components/fields/MultiSelectCheckbox"
import { SelectAllCheckbox } from "src/core/components/fields/SelectAllCheckbox"

// Column helper
const columnHelper = createColumnHelper<NotificationTableData>()

// ColumnDefs
export const useNotificationTableColumns = (refetch: () => void, data: NotificationTableData[]) => {
  const allIds = useMemo(() => data.map((item) => item.id), [data])

  return useMemo(
    () => [
      columnHelper.accessor("createdAt", {
        cell: (info) => <DateFormat date={info.getValue()} />,
        header: "Date",
      }),
      columnHelper.accessor("projectName", {
        header: "Project",
        enableColumnFilter: true,
        enableSorting: true,
        cell: (info) => <span>{info.getValue()}</span>,
      }),
      columnHelper.accessor("type", {
        header: "Type",
        enableColumnFilter: true,
        enableSorting: true,
        cell: (info) => <span>{info.getValue()}</span>,
        meta: {
          filterVariant: "select",
        },
      }),
      columnHelper.accessor("cleanMessage", {
        id: "message",
        header: "Notification Message",
        enableColumnFilter: true,
        enableSorting: true,
        cell: (info) => (
          <NotificationMessage
            message={info.row.original.rawMessage}
            routeData={info.row.original.routeData}
          />
        ),
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
      columnHelper.accessor("id", {
        id: "multiple",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (info) => <MultiSelectCheckbox id={info.getValue()} />,
        header: () => <SelectAllCheckbox allIds={allIds} />,
      }),
    ],
    [refetch, allIds]
  )
}
