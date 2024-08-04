import { createColumnHelper } from "@tanstack/react-table"
import ReadToggle from "../components/ReadToggle"
import { useNotification, ExtendedNotification } from "../components/NotificationContext"
import { Project } from "db"

// Column helper
const columnHelper = createColumnHelper<ExtendedNotification>()

const getProjectName = (project: Project) => {
  return project ? project.name.substring(0, 20) : "N/A"
}

// ColumnDefs
export const useNotificationTableColumns = () => {
  const { refetch } = useNotification()

  return [
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
    columnHelper.accessor("projectId", {
      id: "projectTitle",
      header: "Project",
      //enableColumnFilter: false,
      //enableSorting: false,
      cell: (info) => {
        if (info.getValue()) {
          return <span>{info.row.original.project.name.substring(0, 20)}</span>
        } else {
          return ""
        }
      },
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
}

export const useProjectNotificationTableColumns = () => {
  const { refetch } = useNotification()

  return [
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
}