import { Routes } from "@blitzjs/next"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import DateFormat from "src/core/components/DateFormat"
import { ElementTasksData } from "../processing/processElementTasks"

const columnHelperElement = createColumnHelper<ElementTasksData>()

export const ElementTasksColumns = [
  columnHelperElement.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Name",
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      filterVariant: "text",
    },
  }),
  columnHelperElement.accessor("deadline", {
    cell: (info) => <DateFormat date={info.getValue()}></DateFormat>,
    header: "Due Date",
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      filterVariant: "text",
    },
  }),
  columnHelperElement.accessor("status", {
    header: "Completed",
    cell: (info) => <span>{info.getValue()}</span>,
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      filterVariant: "select",
    },
  }),
  columnHelperElement.accessor("view", {
    id: "view",
    header: "View",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <Link
        className="btn btn-ghost"
        href={Routes.ShowTaskPage({
          projectId: info.getValue().projectId,
          taskId: info.getValue().taskId,
        })}
      >
        <MagnifyingGlassIcon width={25} className="stroke-primary" />
      </Link>
    ),
  }),
]
