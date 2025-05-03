import { Routes } from "@blitzjs/next"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { TeamTaskListData } from "../processing/processTeamTaskList"

const columnHelper = createColumnHelper<TeamTaskListData>()

export const TeamTaskListColumns = [
  columnHelper.accessor("completedBy", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Completed By",
    id: "completedBy",
  }),
  columnHelper.accessor("taskName", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Task Name",
    id: "taskName",
  }),
  columnHelper.accessor("roles", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Roles",
    id: "roles",
  }),
  // change this to task history
  columnHelper.accessor("latestUpdate", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Latest Update",
    id: "lastestUpdate",
  }),
  // add approval for lastest log
  columnHelper.accessor("approved", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Approved",
    id: "approved",
  }),
  columnHelper.accessor("deadline", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Deadline",
    id: "deadline",
  }),
  columnHelper.accessor("taskId", {
    id: "view",
    header: "View",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <Link
        className="btn btn-ghost"
        href={Routes.TaskLogsPage({
          projectId: info.row.original.projectId,
          taskId: info.getValue(),
        })}
      >
        <MagnifyingGlassIcon width={25} className="stroke-primary" />
      </Link>
    ),
  }),
]
