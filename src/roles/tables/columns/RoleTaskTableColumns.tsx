import React, { useMemo } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import { createColumnHelper } from "@tanstack/react-table"
import { MultiSelectCheckbox } from "../../../core/components/fields/MultiSelectCheckbox"
import { SelectAllCheckbox } from "../../../core/components/fields/SelectAllCheckbox"
import { Tooltip } from "react-tooltip"

export type RoleTaskTableData = {
  name: string
  description: string
  rolesNames: string
  id: number
}

const columnHelper = createColumnHelper<RoleTaskTableData>()

// ColumnDefs
export const useRoleTaskTableColumns = (data: RoleTaskTableData[]) => {
  const allIds = useMemo(() => data.map((item) => item.id), [data])

  return useMemo(
    () => [
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
          <div
            className="flex items-center table-header-tooltip"
            data-tooltip-id="role-task-select-all"
          >
            <SelectAllCheckbox allIds={allIds} />
            <Tooltip
              id="role-task-select-all"
              content="This button selects all rows, even those filtered out."
              className="ml-2 z-[1099] ourtooltips"
            />
          </div>
        ),
      }),
    ],
    [allIds]
  )
}
