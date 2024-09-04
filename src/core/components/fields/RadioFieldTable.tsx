import React, { useCallback } from "react"
import Table from "src/core/components/Table"
import { useField } from "react-final-form"

interface RadioFieldTableProps<T> {
  name: string
  options: { id: number; label: string }[]
  extraData?: T[]
  extraColumns?: any[]
}

const RadioFieldTable = <T,>({
  name,
  options,
  extraData = [],
  extraColumns = [],
}: RadioFieldTableProps<T>) => {
  const {
    input: { value: selectedId, onChange: setSelectedId },
    meta,
  } = useField(name, { subscription: { value: true, touched: true, error: true } })

  const handleSelection = useCallback(
    (id) => {
      setSelectedId(id)
    },
    [setSelectedId]
  )

  const columns = React.useMemo(
    () => [
      {
        id: "selection",
        header: "Select",
        cell: ({ row }) => (
          <input
            type="radio"
            className="radio radio-primary"
            checked={selectedId === row.original.id}
            onChange={() => handleSelection(row.original.id)}
          />
        ),
      },
      {
        id: "label",
        header: "Label",
        accessorKey: "label",
      },
      ...extraColumns,
    ],
    [selectedId, handleSelection, extraColumns]
  )

  const data = React.useMemo(
    () => options.map((item, index) => ({ ...item, ...extraData[index] })),
    [options, extraData]
  )

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

export default RadioFieldTable
