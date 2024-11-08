import React from "react"
import { createColumnHelper } from "@tanstack/react-table"
import { MultiSelectCheckbox } from "../../../core/components/fields/MultiSelectCheckbox"

export type RoleTaskTableData = {
  name: string
  description: string
  rolesNames: string
  id: number
}

const columnHelper = createColumnHelper<RoleTaskTableData>()

// ColumnDefs
export const RoleTaskTableColumns = [
  columnHelper.accessor("name", {
    id: "name",
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Name",
  }),
  columnHelper.accessor("description", {
    id: "description",
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Description",
  }),
  columnHelper.accessor("rolesNames", {
    id: "rolesNames",
    header: "Roles",
    cell: (info) => <span>{info.getValue()}</span>,
    enableColumnFilter: true,
  }),
  columnHelper.accessor("id", {
    id: "multiple",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <MultiSelectCheckbox id={info.getValue()}></MultiSelectCheckbox>,
    header: "Add Multiple",
  }),
]
