import { createColumnHelper } from "@tanstack/react-table"
import ReadToggle from "../components/ReadToggle"
import { Notification, Project } from "db"
import { useMemo } from "react"
import DateFormat from "src/core/components/DateFormat"
import HtmlFormat from "src/core/components/HtmlFormat"

const stripHtmlTags = (htmlString: string) => {
  const doc = new DOMParser().parseFromString(htmlString, "text/html")
  return doc.body.textContent || ""
}

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
      columnHelper.accessor((row) => stripHtmlTags(row.message || ""), {
        id: "message",
        header: "Notification Message",
        enableColumnFilter: true,
        enableSorting: true,
        cell: (info) => (
          <div dangerouslySetInnerHTML={{ __html: info.row.original.message || "" }} />
        ),
        meta: {
          filterVariant: "text",
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
      columnHelper.accessor((row) => stripHtmlTags(row.message || ""), {
        id: "message",
        header: "Notification Message",
        enableColumnFilter: true,
        enableSorting: true,
        cell: (info) => <HtmlFormat html={info.getValue()} />,
        meta: {
          filterVariant: "text",
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
