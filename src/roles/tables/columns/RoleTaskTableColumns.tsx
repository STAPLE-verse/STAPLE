import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import { createColumnHelper } from "@tanstack/react-table"
import { MultiSelectCheckbox } from "../../../core/components/fields/MultiSelectCheckbox"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip } from "react-tooltip"

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
    cell: (info) => {
      const value = info.getValue() || ""
      const truncated = value.length > 200 ? `${value.slice(0, 200)}...` : value
      return (
        <div className="markdown-display">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{truncated}</ReactMarkdown>
        </div>
      )
    },
    header: "Instructions",
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
    cell: (info) => <MultiSelectCheckbox id={info.getValue()} />,
    header: () => (
      <div className="table-header-tooltip">
        Select
        <InformationCircleIcon
          className="h-5 w-5 stroke-2 text-info"
          data-tooltip-id="select-required-tooltip"
        />
        <Tooltip
          id="select-required-tooltip"
          content="You must first select at least one task or collaborator to add a role."
          className="z-[1099] ourtooltips"
        />
      </div>
    ),
  }),
]
