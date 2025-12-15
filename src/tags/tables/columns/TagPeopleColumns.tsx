import { createColumnHelper, FilterFn } from "@tanstack/react-table"
import DateFormat from "src/core/components/DateFormat"
import Link from "next/link"
import { Routes } from "@blitzjs/next"
import { createDateTextFilter } from "src/core/utils/tableFilters"

export type TagPeopleData = {
  name: string
  createdAt: Date
  percentTasksComplete: number | null
  percentApproved: number | null
  percentFormsComplete: number | null
  formAssignedCount: number
  roles: string[] | null
  type: string
  userId: number
  projectId: number
  completionStatus: "Completed" | "Not completed"
}

const columnHelper = createColumnHelper<TagPeopleData>()
const createdDateFilter = createDateTextFilter({ emptyLabel: "no date" })
const completionStatusFilter: FilterFn<TagPeopleData> = (row, columnId, filterValue) => {
  const selected = String(filterValue ?? "").trim()

  if (!selected) {
    return true
  }

  return String(row.getValue(columnId) ?? "") === selected
}

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
    enableColumnFilter: true,
    enableSorting: true,
    filterFn: createdDateFilter,
    meta: {
      filterVariant: "text",
    },
  }),
  columnHelper.accessor("percentTasksComplete", {
    header: "Tasks Complete",
    cell: (info) => (info.getValue() === null ? "N/A" : `${info.getValue()}%`),
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      filterVariant: "range",
    },
  }),
  columnHelper.accessor("completionStatus", {
    header: "Status",
    cell: (info) => info.getValue(),
    enableColumnFilter: true,
    enableSorting: true,
    filterFn: completionStatusFilter,
    meta: {
      filterVariant: "select",
    },
  }),
  columnHelper.accessor("percentApproved", {
    header: "Tasks Approved",
    cell: (info) => (info.getValue() === null ? "N/A" : `${info.getValue()}%`),
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      filterVariant: "range",
    },
  }),
  columnHelper.accessor("percentFormsComplete", {
    header: "Forms Complete",
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
    cell: (info) => info.getValue()?.join(", ") ?? "None",
  }),
]
