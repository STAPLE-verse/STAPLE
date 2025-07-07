import { createColumnHelper } from "@tanstack/react-table"
import DateFormat from "src/core/components/DateFormat"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"
import Link from "next/link"
import { Routes } from "@blitzjs/next"

export type TagPeopleData = {
  name: string
  createdAt: Date
  percentTasksComplete: number
  percentApproved: number
  percentFormsComplete: number
  roles: string[] | null
  type: string
  userId: number
  projectId: number
}

const columnHelper = createColumnHelper<TagPeopleData>()

export const TagPeopleColumns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => {
      const row = info.row.original
      const href =
        row.type === "Individual"
          ? Routes.ShowContributorPage({ projectId: row.projectId, contributorId: row.userId })
          : Routes.ShowTeamPage({ projectId: row.projectId, teamId: row.userId })
      return (
        <Link href={href}>
          <button className="btn w-full btn-primary">{info.getValue()}</button>
        </Link>
      )
    },
  }),
  columnHelper.accessor("createdAt", {
    header: "Start Date",
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
    cell: (info) => info.getValue()?.join(", ") ?? "None",
  }),
]
