import { createColumnHelper, FilterFn } from "@tanstack/react-table"
import { useMemo } from "react"
import DateFormat from "src/core/components/DateFormat"
import ReadToggle from "src/notifications/components/ReadToggle"
import { ProjectNotificationData } from "../processing/processProjectNotification"
import { MultiSelectCheckbox } from "src/core/components/fields/MultiSelectCheckbox"
import NotificationMessage from "src/notifications/components/NotificationMessage"
import { SelectAllCheckbox } from "src/core/components/fields/SelectAllCheckbox"
import { createDateTextFilter } from "src/core/utils/tableFilters"
import { Tooltip } from "react-tooltip"

// Column helper
const columnHelper = createColumnHelper<ProjectNotificationData>()
const notificationDateFilter = createDateTextFilter({ emptyLabel: "no date" })
const readStatusFilter: FilterFn<ProjectNotificationData> = (row, columnId, filterValue) => {
  const selected = String(filterValue ?? "")
    .trim()
    .toLowerCase()

  if (!selected) {
    return true
  }

  const status = String(row.getValue(columnId) ?? "")
    .trim()
    .toLowerCase()

  return status === selected
}

// ColumnDefs
export const useProjectNotificationTableColumns = (
  refetch: () => void,
  data: ProjectNotificationData[]
) => {
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
        enableColumnFilter: true,
        enableSorting: false,
        cell: (info) => (
          <ReadToggle notification={info.row.original.notification} refetch={refetch} />
        ),
        header: "Read",
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
            data-tooltip-id="project-notification-select-all"
          >
            <SelectAllCheckbox allIds={allIds} />
            <Tooltip
              id="project-notification-select-all"
              content="Selects all notifications on this page even when filtered."
              className="ml-2 z-[1099] ourtooltips"
            />
          </div>
        ),
      }),
    ],
    [refetch, allIds]
  )
}
