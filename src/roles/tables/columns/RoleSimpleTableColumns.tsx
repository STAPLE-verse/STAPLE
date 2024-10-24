import { createColumnHelper } from "@tanstack/react-table"
import { RoleSimpleTableData } from "../processing/processRoleSimpleTableData"

const columnHelper = createColumnHelper<RoleSimpleTableData>()

// ColumnDefs
export const RoleSimpleTableColumns = [
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
