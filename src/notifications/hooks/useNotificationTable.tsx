import { createColumnHelper } from "@tanstack/react-table"
import ReadToggle from "../components/ReadToggle"
import { Notification, Project } from "db"
import { useMemo } from "react"
import DateFormat from "src/core/components/DateFormat"

// Type for notifications with project included
export type ExtendedNotification = Notification & {
  project: Project
}

// Column helper
const columnHelper = createColumnHelper<ExtendedNotification>()

// ColumnDefs
export const useNotificationTableColumns = (refetch: () => void) => {
  return useMemo(
    () => [
      columnHelper.accessor("createdAt", {
        cell: (info) => <DateFormat date={info.getValue()}></DateFormat>,
        header: "Date",
      }),
      columnHelper.accessor("project.name", {
        id: "projectTitle",
        header: "Project",
        enableColumnFilter: true,
        enableSorting: true,
        cell: (info) => {
          if (info.getValue()) {
            return <span>{info.getValue().substring(0, 20)}</span>
          } else {
            return ""
          }
        },
      }),
      columnHelper.accessor("message", {
        id: "message",
        header: "Notification Message",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (info) => <div dangerouslySetInnerHTML={{ __html: info.getValue() }} />,
        meta: {
          filterVariant: "multiselect",
          isHtml: true,
        },
      }),
      columnHelper.accessor("read", {
        enableColumnFilter: false,
        //enableSorting: false,
        cell: (info) => <ReadToggle notification={info.row.original} refetch={refetch} />,
        header: "Read",
      }),
    ],
    [refetch]
  )
}

export const useProjectNotificationTableColumns = (refetch: () => void) => {
  return useMemo(
    () => [
      columnHelper.accessor("createdAt", {
        cell: (info) => <DateFormat date={info.getValue()}></DateFormat>,
        header: "Date",
      }),
      columnHelper.accessor("message", {
        id: "message",
        header: "Notification Message",
        enableColumnFilter: true,
        enableSorting: false,
        cell: (info) => <div dangerouslySetInnerHTML={{ __html: info.getValue() }} />,
        meta: {
          filterVariant: "select",
          isHtml: true,
        },
      }),
      columnHelper.accessor("read", {
        enableColumnFilter: false,
        enableSorting: false,
        cell: (info) => <ReadToggle notification={info.row.original} refetch={refetch} />,
        header: "Read",
      }),
    ],
    [refetch]
  )
}
