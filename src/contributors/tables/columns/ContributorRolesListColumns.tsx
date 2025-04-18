import { createColumnHelper } from "@tanstack/react-table"
import { ContributorRolesListData } from "../processing/processContributorRolesList"

const columnHelper = createColumnHelper<ContributorRolesListData>()

// ColumnDefs
export const ContributorRolesListColumns = [
  columnHelper.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Role Name",
  }),
  columnHelper.accessor("description", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Description",
  }),
  columnHelper.accessor("taxonomy", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "System",
  }),
]
