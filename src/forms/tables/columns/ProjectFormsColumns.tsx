import { createColumnHelper } from "@tanstack/react-table"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { DocumentTextIcon, InformationCircleIcon } from "@heroicons/react/24/outline"
import { ProjectFormData } from "../processing/processProjectForms"
import { Tooltip } from "react-tooltip"
import { JsonFormModal } from "src/core/components/JsonFormModal"

const columnHelper = createColumnHelper<ProjectFormData>()

export const ProjectFormsColumns = [
  columnHelper.accessor("taskName", {
    cell: (info) => (
      <Link
        className="btn btn-secondary"
        href={Routes.ShowTaskPage({
          taskId: info.row.original.taskId,
          projectId: info.row.original.projectId,
        })}
      >
        {info.getValue()}
      </Link>
    ),
    header: "Task",
  }),
  columnHelper.accessor((row) => "review", {
    id: "review",
    cell: (info) => (
      <JsonFormModal
        schema={info.row.original.formSchema}
        uiSchema={info.row.original.formUi}
        metadata={{}} // Adjust metadata as needed
        label={info.row.original.formName}
        classNames="btn-primary"
        submittable={false}
      />
    ),
    header: (
      <div className="table-header-tooltip">
        Required Form
        <InformationCircleIcon
          className="h-4 w-4 ml-1 text-info stroke-2"
          data-tooltip-id="dashboard-overview"
        />
        <Tooltip
          id="dashboard-overview"
          content="Use the buttons in this column to review the required form for each task."
          className="z-[1099] ourtooltips"
        />
      </div>
    ),
  }),
  columnHelper.accessor("percentComplete", {
    header: "Completion",
    enableColumnFilter: true,
    enableSorting: true,
    cell: (info) => <div>{info.getValue()}%</div>,
    meta: {
      filterVariant: "range",
    },
  }),
  columnHelper.accessor("percentApproved", {
    header: "Approved",
    enableColumnFilter: true,
    enableSorting: true,
    cell: (info) => <div>{info.getValue()}%</div>,
    meta: {
      filterVariant: "range",
    },
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
        <DocumentTextIcon width={25} className="stroke-primary" />
      </Link>
    ),
    header: "Responses",
  }),
]
