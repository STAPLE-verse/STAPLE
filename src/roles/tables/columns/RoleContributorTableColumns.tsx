import { createColumnHelper } from "@tanstack/react-table"
import { RoleContributorTableData } from "../processing/processRoleContributorTableData"

const columnHelper = createColumnHelper<RoleContributorTableData>()

// ColumnDefs
export const RoleContributorTableColumns = [
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
    header: "Taxonomy",
  }),
]
