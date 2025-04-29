import React from "react"
import { createColumnHelper } from "@tanstack/react-table"
import { MultiSelectCheckbox } from "src/core/components/fields/MultiSelectCheckbox"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"

export type ContributorRoleData = {
  username: string
  firstname: string
  lastname: string
  roleNames: string
  id: number
}

const columnHelper = createColumnHelper<ContributorRoleData>()

// ColumnDefs
export const RoleContributorTableColumns = [
  columnHelper.accessor("username", {
    id: "username",
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Username",
  }),

  columnHelper.accessor("firstname", {
    id: "firstname",
    cell: (info) => <span>{info.getValue()}</span>,
    header: "First Name",
  }),
  columnHelper.accessor("lastname", {
    id: "lastaname",
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Last Name",
  }),
  columnHelper.accessor("roleNames", {
    id: "roleNames",
    header: "Roles",
    cell: (info) => <div>{info.getValue()}</div>,
    enableColumnFilter: true,
  }),
  columnHelper.accessor("id", {
    id: "multiple",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <MultiSelectCheckbox id={info.getValue()} />,
    header: () => (
      <div className="table-header-tooltip">
        Select
        <InformationCircleIcon
          className="h-5 w-5 stroke-2 text-info"
          data-tooltip-id="select-required-tooltip"
        />
        <Tooltip
          id="select-required-tooltip"
          content="You must first select at least one task or collaborator to add a role."
          className="z-[1099] ourtooltips"
        />
      </div>
    ),
  }),
]
