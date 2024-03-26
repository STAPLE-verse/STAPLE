import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import React from "react"

import TextFilter from "src/core/components/TextFilter"

type TableProps<TData> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[]
  data: TData[]
  filters?: {} //pass object with the type of  filter for a given colunm based on colunm id
  enableSorting?: boolean
  classNames?: {
    table?: string
    thead?: string
    tbody?: string
    tfoot?: string
    th?: string
    td?: string
  }
}

const Table = <TData,>({ columns, data, classNames, enableSorting = true }: TableProps<TData>) => {
  const [sorting, setSorting] = React.useState([])

  const table = useReactTable({
    data,
    columns,
    enableSorting: enableSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    state: {
      sorting: sorting,
    },
    onSortingChange: setSorting,
  })

  return (
    <>
      <table className={classNames?.table || "table"}>
        <thead className={classNames?.thead || "text-xl"}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className={classNames?.th}>
                  {header.isPlaceholder ? null : (
                    <>
                      <div
                        className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {/* TODO change this icon */}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                      {header.column.getCanFilter() ? (
                        <div>
                          {/* get filter based on colunm id or type */}
                          <TextFilter column={header.column} table={table} />
                        </div>
                      ) : null}
                    </>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className={classNames?.tbody || "text-lg"}>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={classNames?.td}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot className={classNames?.tfoot}>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.footer, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </>
  )
}

export default Table
