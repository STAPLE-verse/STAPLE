import React from "react"
import { createColumnHelper } from "@tanstack/react-table"
import { AddTaskRolesColumn } from "../../components/AddTaskRolesColumn"
import { MultipleCheckboxColumn } from "../../components/MultipleCheckboxColumn"
import { RoleTaskTableData } from "../processing/processRoleTaskTableData"

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
    id: "open",
    header: "Add Role",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <AddTaskRolesColumn row={info.row.original}></AddTaskRolesColumn>,
  }),

  columnHelper.accessor("id", {
    id: "multiple",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <MultipleCheckboxColumn row={info.row.original}></MultipleCheckboxColumn>,
    header: "Add Multiple",
  }),
]
