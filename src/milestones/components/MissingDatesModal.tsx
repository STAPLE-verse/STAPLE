import React, { useState, useMemo, useEffect } from "react"
import { useMutation } from "@blitzjs/rpc"
import { ColumnDef } from "@tanstack/react-table"
import Table from "src/core/components/Table"
import Modal from "src/core/components/Modal"
import updateTaskDates from "src/tasks/mutations/updateTaskDates"
import updateMilestoneDates from "../mutations/updateMilestoneDates"

export type GanttRow = {
  id: number
  type: "milestone" | "task"
  name: string
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
}

interface Props {
  rows: GanttRow[]
  open: boolean
  onClose: () => void
  onDatesUpdated: () => void
}

const MissingDatesModal: React.FC<Props> = ({ rows, open, onClose, onDatesUpdated }) => {
  const [data, setData] = useState<GanttRow[]>([])
  const [updateMilestoneDatesMutation] = useMutation(updateMilestoneDates)
  const [updateTaskDatesMutation] = useMutation(updateTaskDates)

  useEffect(() => {
    if (open) setData(rows)
  }, [open, rows])

  const handleDateChange = (
    id: number,
    type: "milestone" | "task",
    field: "startDate" | "endDate",
    value: string
  ) => {
    setData((prev) =>
      prev.map((r) => (r.id === id && r.type === type ? { ...r, [field]: value } : r))
    )
  }

  const columns = useMemo<ColumnDef<GanttRow, any>[]>(
    () => [
      {
        header: "Type",
        accessorKey: "type",
        id: "type",
        enableColumnFilter: true,
        enableSorting: true,
      },
      {
        header: "Name",
        accessorKey: "name",
        id: "name",
        enableColumnFilter: true,
        enableSorting: true,
      },
      {
        header: "Start Date",
        accessorKey: "startDate",
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <input
            type="date"
            value={row.original.startDate}
            onChange={(e) =>
              handleDateChange(row.original.id, row.original.type, "startDate", e.target.value)
            }
            className="input input-bordered text-lg border-primary rounded w-full border-2 bg-base-300 text-primary"
            min="2000-01-01"
            max="2050-01-01"
          />
        ),
      },
      {
        header: "End Date",
        accessorKey: "endDate",
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <input
            type="date"
            value={row.original.endDate}
            onChange={(e) =>
              handleDateChange(row.original.id, row.original.type, "endDate", e.target.value)
            }
            className="input input-bordered text-lg border-primary rounded w-full border-2 bg-base-300 text-primary"
            min="2000-01-01"
            max="2050-01-01"
          />
        ),
      },
    ],
    []
  )

  const handleSave = async () => {
    for (const r of data) {
      if (!r.startDate || !r.endDate) continue
      const start = new Date(r.startDate)
      const end = new Date(r.endDate)

      if (start > end) {
        alert(`Start date cannot be after end date for "${r.name}" (${r.type})`)
        continue
      }

      if (r.type === "milestone") {
        await updateMilestoneDatesMutation({
          id: r.id,
          startDate: start,
          endDate: end,
        })
      } else {
        await updateTaskDatesMutation({
          id: r.id,
          startDate: start,
          deadline: end,
        })
      }
    }
    onDatesUpdated()
  }

  return (
    <Modal open={open} size="max-w-4xl">
      <h1 className="flex justify-center mb-2 text-3xl">Fill in Missing Dates</h1>
      <Table columns={columns} data={data} addPagination />
      <div className="flex justify-end gap-2 mt-4">
        <button className="btn btn-primary" onClick={handleSave}>
          Save
        </button>
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  )
}

export default MissingDatesModal
