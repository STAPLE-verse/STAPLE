import React, { useCallback } from "react"
import Table from "src/core/components/Table"
import { useField } from "react-final-form"

interface CheckboxFieldTableProps<T> {
  name: string
  options: { id: number; label: string }[]
  extraData?: T[]
  extraColumns?: any[]
}

const CheckboxFieldTable = <T,>({
  name,
  options,
  extraData = [],
  extraColumns = [],
}: CheckboxFieldTableProps<T>) => {
  // Access the form's field state and helpers for the field that will store the array of selected IDs
  const {
    input: { value: selectedIds, onChange: setSelectedIds },
    meta,
  } = useField(name, { subscription: { value: true, touched: true, error: true } })

  const toggleSelection = useCallback(
    (id) => {
      const isSelected = selectedIds.includes(id)
      const newSelectedIds = isSelected
        ? selectedIds.filter((selectedId) => selectedId !== id)
        : [...selectedIds, id]
      setSelectedIds(newSelectedIds)
    },
    [selectedIds, setSelectedIds]
  )

  const columns = React.useMemo(
    () => [
      {
        id: "selection",
        header: "Select",
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="checkbox checkbox-primary border-2"
            checked={selectedIds.includes(row.original.id)}
            onChange={() => toggleSelection(row.original.id)}
          />
        ),
      },
      {
        id: "name",
        accessorKey: "label",
        header: "Name",
        cell: (info) => info.getValue(),
      },
      ...extraColumns,
    ],
    [selectedIds, toggleSelection, extraColumns]
  )

  const data = React.useMemo(
    () => options.map((item, index) => ({ ...item, ...extraData[index] })),
    [options, extraData]
  )

  return (
    <div>
      <Table columns={columns} data={data} addPagination={true} />
      {meta.touched && meta.error && (
        <div role="alert" style={{ color: "red" }}>
          {meta.error}
        </div>
      )}
    </div>
  )
}

export default CheckboxFieldTable
