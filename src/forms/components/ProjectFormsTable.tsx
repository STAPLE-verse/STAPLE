import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { FormVersion, Task } from "db"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"

export interface TaskWithFormVersion extends Task {
  formVersion: FormVersion | null
}
const columnHelper = createColumnHelper<TaskWithFormVersion>()

export const projectFormsTableColumns = [
  columnHelper.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Task",
  }),
  columnHelper.accessor((row) => row.formVersion?.name, {
    id: "formVersionSchema",
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Form Required",
  }),
  // Check if the id is correct
  columnHelper.accessor("id", {
    id: "view",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <Link
        className="btn btn-ghost"
        href={Routes.ShowMetadataPage({
          taskId: info.getValue(),
          projectId: info.row.original.projectId,
        })}
      >
        <MagnifyingGlassIcon width={25} className="stroke-primary" />
      </Link>
    ),
    header: "View",
  }),
]
