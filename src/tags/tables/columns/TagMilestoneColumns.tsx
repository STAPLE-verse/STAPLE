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
  roles: string[]
}

const columnHelper = createColumnHelper<TagMilestoneData>()

export const TagMilestoneColumns = [
  columnHelper.accessor("name", {
    header: "Milestone Name",
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
      <div className="flex items-center gap-1">
        Tasks Complete
        <InformationCircleIcon
          className="h-4 w-4 text-info stroke-2"
          data-tooltip-id="task-complete"
        />
        <Tooltip
          id="task-complete"
          content="Percentage of tasks completed for this milestone. Calculated from the latest logs per user-task combination."
          className="z-[1099] table-header-tooltip"
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
    header: "Tasks Approved",
    cell: (info) => `${info.getValue()}%`,
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      filterVariant: "range",
    },
  }),
  columnHelper.accessor("percentFormsComplete", {
    header: "Forms Complete",
    cell: (info) => `${info.getValue()}%`,
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
