import { createColumnHelper, FilterFn } from "@tanstack/react-table"
import { useMemo } from "react"
import DateFormat from "src/core/components/DateFormat"
import ReadToggle from "src/notifications/components/ReadToggle"
import { NotificationTableData } from "../processing/processNotification"
import NotificationMessage from "src/notifications/components/NotificationMessage"
import { MultiSelectCheckbox } from "src/core/components/fields/MultiSelectCheckbox"
import { SelectAllCheckbox } from "src/core/components/fields/SelectAllCheckbox"
import { Tooltip } from "react-tooltip"
import { createDateTextFilter } from "src/core/utils/tableFilters"

// Column helper
const columnHelper = createColumnHelper<NotificationTableData>()
const notificationDateFilter = createDateTextFilter({ emptyLabel: "no date" })
const readStatusFilter: FilterFn<NotificationTableData> = (row, columnId, filterValue) => {
  const selected = String(filterValue ?? "").trim()
  if (!selected) {
    return true
  }
  return String(row.getValue(columnId)) === selected
}

// ColumnDefs
export const useNotificationTableColumns = (refetch: () => void, data: NotificationTableData[]) => {
  const allIds = useMemo(() => data.map((item) => item.id), [data])

  return useMemo(
    () => [
      columnHelper.accessor("createdAt", {
        cell: (info) => <DateFormat date={info.getValue()} />,
        header: "Date",
        enableColumnFilter: true,
        enableSorting: true,
        filterFn: notificationDateFilter,
        meta: {
          filterVariant: "text",
        },
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
            isMarkdown={info.row.original.isMarkdown}
          />
        ),
        meta: {
          filterVariant: "text",
          isHtml: true,
        },
      }),
      columnHelper.accessor((row) => (row.notification.read ? "Read" : "Unread"), {
        id: "readStatus",
        header: "Read",
        enableColumnFilter: true,
        enableSorting: false,
        cell: (info) => (
          <ReadToggle notification={info.row.original.notification} refetch={refetch} />
        ),
        filterFn: readStatusFilter,
        meta: {
          filterVariant: "select",
        },
      }),
      columnHelper.accessor("id", {
        id: "multiple",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (info) => <MultiSelectCheckbox id={info.getValue()} />,
        header: () => (
          <div
            className="flex items-center table-header-tooltip"
            data-tooltip-id="notification-select-all"
          >
            <SelectAllCheckbox allIds={allIds} />
            <Tooltip
              id="notification-select-all"
              content="Selects all notifications on this page even when filtered."
              className="z-[1099] ourtooltips"
            />
          </div>
        ),
      }),
    ],
    [refetch, allIds]
  )
}
