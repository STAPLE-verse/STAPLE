import React, { useCallback } from "react"
import Table from "src/core/components/Table"
import { useField } from "react-final-form"

const CheckboxFieldTable = ({ name, options }) => {
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
        header: () => null,
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selectedIds.includes(row.original.id)}
            onChange={() => toggleSelection(row.original.id)}
          />
        ),
      },
      {
        accessorKey: "label",
        header: "Name",
        cell: (info) => info.getValue(),
      },
    ],
    [selectedIds, toggleSelection]
  )

  const data = React.useMemo(() => options, [options])

  return (
    <>
      <Table columns={columns} data={data} />
      {meta.touched && meta.error && (
        <div role="alert" style={{ color: "red" }}>
          {meta.error}
        </div>
      )}
    </>
  )
}

export default CheckboxFieldTable
