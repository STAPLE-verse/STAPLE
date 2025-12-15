import React, { useMemo } from "react"
import { createColumnHelper } from "@tanstack/react-table"
import { MultiSelectCheckbox } from "src/core/components/fields/MultiSelectCheckbox"
import { SelectAllCheckbox } from "src/core/components/fields/SelectAllCheckbox"
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
export const useRoleContributorTableColumns = (data: ContributorRoleData[]) => {
  const allIds = useMemo(() => data.map((item) => item.id), [data])

  return useMemo(
    () => [
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
        id: "lastname",
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
          <div
            className="flex items-center table-header-tooltip"
            data-tooltip-id="role-contributor-select-all"
          >
            <SelectAllCheckbox allIds={allIds} />
            <Tooltip
              id="role-contributor-select-all"
              content="This button selects all rows, even those filtered out."
              className="z-[1099] ourtooltips"
            />
          </div>
        ),
      }),
    ],
    [allIds]
  )
}
