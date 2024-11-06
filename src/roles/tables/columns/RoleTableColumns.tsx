import { createColumnHelper } from "@tanstack/react-table"
import { DeleteRole } from "src/roles/components/DeleteRole"
import { EditRole } from "src/roles/components/EditRole"
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
    cell: (info) => (
      <EditRole
        id={info.getValue()}
        name={info.row.original.name}
        description={info.row.original.description}
        taxonomy={info.row.original.taxonomy}
        userId={info.row.original.userId}
        taxonomyList={info.row.original.taxonomyList}
        onChangeCallback={info.row.original.onChangeCallback}
      />
    ),
  }),
  columnHelper.accessor("id", {
    id: "delete",
    header: "Delete",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <DeleteRole id={info.getValue()} onChangeCallback={info.row.original.onChangeCallback} />
    ),
  }),
]
