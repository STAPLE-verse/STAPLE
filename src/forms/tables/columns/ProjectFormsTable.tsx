import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { ProjectFormTableData } from "../processing/processProjectFormsTableData"

const columnHelper = createColumnHelper<ProjectFormTableData>()

export const projectFormsTableColumns = [
  columnHelper.accessor("taskName", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Task",
  }),
  columnHelper.accessor("formName", {
    id: "formVersionSchema",
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Form Required",
  }),
  // Check if the id is correct
  columnHelper.accessor("taskId", {
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
