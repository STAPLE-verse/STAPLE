import React from "react"
import { HTMLAttributes, ClassAttributes } from "react"
import { Task } from "@prisma/client"

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

// TODO: Pass className attributes props for styling in parent
interface TaskTableProps extends HTMLAttributes<HTMLElement>, ClassAttributes<HTMLElement> {
  tasks: Task[]
}

const TaskTable = ({ tasks }: TaskTableProps) => {
  const columnHelper = createColumnHelper<Task>()

  const columns = [
    columnHelper.accessor("name", {
      cell: (info) => <span>{info.getValue()}</span>,
      header: (info) => info.column.id,
    }),
    columnHelper.accessor("description", {
      id: "description",
      cell: (info) => <span>{info.getValue()}</span>,
      header: (info) => info.column.id,
    }),
  ]

  const [data, setData] = React.useState(() => [...tasks])
  const rerender = React.useReducer(() => ({}), {})[1]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="flex flex-col justify-center p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
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
      <div className="h-4" />
      <button onClick={() => rerender()} className="btn">
        Rerender
      </button>
    </div>
  )
}

export default TaskTable
