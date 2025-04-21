import { createColumnHelper } from "@tanstack/react-table"
import { RoleTeamTableData } from "../processing/processRoleTeam"

const columnHelper = createColumnHelper<RoleTeamTableData>()

// ColumnDefs
export const RoleTeamTableColumns = [
  columnHelper.accessor("userName", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "User Name",
  }),
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
