import { Routes } from "@blitzjs/next"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { TeamTaskListDoneData } from "../processing/processTeamTaskListDone"

const columnHelper = createColumnHelper<TeamTaskListDoneData>()

export const TeamTaskListDoneColumns = [
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
  columnHelper.accessor("latestUpdate", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Latest Update",
    id: "lastestUpdate",
  }),
  columnHelper.accessor("taskId", {
    id: "view",
    header: "View",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <Link
        className="btn btn-ghost"
        href={Routes.ShowTaskPage({
          projectId: info.row.original.projectId,
          taskId: info.getValue(),
        })}
      >
        <MagnifyingGlassIcon width={25} className="stroke-primary" />
      </Link>
    ),
  }),
]
