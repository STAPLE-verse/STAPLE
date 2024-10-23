import { createColumnHelper } from "@tanstack/react-table"
import { DeleteColumn } from "src/roles/components/DeleteColumn"
import { EditColumn } from "src/roles/components/EditColumn"
import { RoleTableData } from "../processing/processRoleTableData"

const columnHelper = createColumnHelper<RoleTableData>()

// ColumnDefs
export const RoleTableColumns = [
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
  columnHelper.accessor("id", {
    id: "edit",
    header: "Edit",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <EditColumn row={info.row.original}></EditColumn>,
  }),
  columnHelper.accessor("id", {
    id: "delete",
    header: "Delete",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <DeleteColumn row={info.row.original}></DeleteColumn>,
  }),
]
