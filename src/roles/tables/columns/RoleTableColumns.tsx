import { createColumnHelper } from "@tanstack/react-table"
import { DeleteRole } from "src/roles/components/DeleteRole"
import { EditRole } from "src/roles/components/EditRole"
import { RoleTableData } from "../processing/processRoleTableData"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"

const columnHelper = createColumnHelper<RoleTableData>()

// ColumnDefs
export const RoleTableColumns = [
  columnHelper.accessor("name", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Role Name",
  }),
  columnHelper.accessor("description", {
    cell: (info) => {
      const value = info.getValue() || ""
      return (
        <div className="markdown-display">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{value}</ReactMarkdown>
        </div>
      )
    },
    header: "Description",
  }),
  columnHelper.accessor("taxonomy", {
    cell: (info) => <span>{info.getValue()}</span>,
    header: "System",
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
        onRolesChanged={info.row.original.onRolesChanged}
      />
    ),
  }),
  columnHelper.accessor("id", {
    id: "delete",
    header: "Delete",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => (
      <DeleteRole id={info.getValue()} onRolesChanged={info.row.original.onRolesChanged} />
    ),
  }),
]
