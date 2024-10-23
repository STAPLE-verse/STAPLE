import React from "react"
import { createColumnHelper } from "@tanstack/react-table"
import { AddContributorRolesColumn } from "../../components/AddContributorRolesColumn"
import { MultipleCheckboxColumn } from "src/roles/components/MultipleCheckboxColumn"
import { ProjectMemberRoleData } from "../processing/processProjectMemberTableData"

const columnHelper = createColumnHelper<ProjectMemberRoleData>()

// ColumnDefs
export const RoleProjectMemberTableColumns = [
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
    id: "open",
    header: "Add Role",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <AddContributorRolesColumn row={info.row.original}></AddContributorRolesColumn>,
  }),
  columnHelper.accessor("id", {
    id: "multiple",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <MultipleCheckboxColumn row={info.row.original}></MultipleCheckboxColumn>,
    header: "Add Multiple",
  }),
]
