import React from "react"

import { createColumnHelper } from "@tanstack/react-table"

export type PmLabelInformation = {
  name: string
  description?: string
  id: number
  selectedIds: number[]
  user: string
  onChangeCallback?: () => void
  onMultipledAdded?: (selectedId) => void
}

//TODO move to another component
export const MultipleCheckboxColumn = ({ row }) => {
  const handleOnChange = (id) => {
    if (row.onMultipledAdded != undefined) {
      row.onMultipledAdded(id)
    }
  }

  return (
    <div>
      <span>
        {
          <div>
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-primary border-2"
                checked={row.selectedIds.includes(row.id)}
                onChange={() => {
                  handleOnChange(row.id)
                }}
              />
            </label>
          </div>
        }
      </span>
    </div>
  )
}

const columnHelper = createColumnHelper<PmLabelInformation>()

// ColumnDefs
export const labelPmTableColumns = [
  columnHelper.accessor("name", {
    id: "name",
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Name",
  }),

  columnHelper.accessor("description", {
    id: "description",
    cell: (info) => <span>{info.getValue()}</span>,
    header: "Description",
  }),
  columnHelper.accessor("user", {
    id: "pm",
    cell: (info) => <span>{info.getValue()}</span>,
    header: "PM Username",
  }),

  columnHelper.accessor("id", {
    id: "multiple",
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => <MultipleCheckboxColumn row={info.row.original}></MultipleCheckboxColumn>,
    header: "Use in Project",
  }),
]
