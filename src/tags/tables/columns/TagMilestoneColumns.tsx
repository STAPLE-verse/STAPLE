import { createColumnHelper } from "@tanstack/react-table"
import DateFormat from "src/core/components/DateFormat"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"

export type TagMilestoneData = {
  name: string
  startDate: Date | null
  endDate: Date | null
  percentTasksComplete: number
  percentApproved: number
  percentFormsComplete: number
  formAssignedCount: number
  roles: string[]
}

const columnHelper = createColumnHelper<TagMilestoneData>()

export const TagMilestoneColumns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("startDate", {
    header: "Start Date",
    cell: (info) => <DateFormat date={info.getValue()} />,
  }),
  columnHelper.accessor("endDate", {
    header: "End Date",
    cell: (info) => <DateFormat date={info.getValue()} />,
  }),
  columnHelper.accessor("percentTasksComplete", {
    header: () => (
      <div className="table-header-tooltip whitespace-normal leading-tight">
        Tasks
        <br />
        Complete
        <InformationCircleIcon
          className="h-6 w-6 ml-1 text-info stroke-2 inline-block"
          data-tooltip-id="task-complete-milestone"
        />
        <Tooltip
          id="task-complete-milestone"
          content="Percentage of tasks completed for this milestone. Calculated from the latest logs per user-task combination."
          className="z-[1099] ourtooltips"
        />
      </div>
    ),
    cell: (info) => `${info.getValue()}%`,
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      filterVariant: "range",
    },
  }),
  columnHelper.accessor("percentApproved", {
    header: () => (
      <div className="table-header-tooltip whitespace-normal leading-tight">
        Tasks
        <br />
        Approved
      </div>
    ),
    cell: (info) => `${info.getValue()}%`,
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      filterVariant: "range",
    },
  }),
  columnHelper.accessor("percentFormsComplete", {
    header: () => (
      <div className="table-header-tooltip whitespace-normal leading-tight">
        Forms
        <br />
        Complete
      </div>
    ),
    cell: (info) => {
      const row = info.row.original
      return row.formAssignedCount === 0 ? "N/A" : `${info.getValue()}%`
    },
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      filterVariant: "range",
    },
  }),
  columnHelper.accessor("roles", {
    header: "Role Labels",
    cell: (info) => info.getValue().join(", "),
  }),
]
