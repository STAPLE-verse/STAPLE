import React, { useCallback } from "react"
import Table from "src/core/components/Table"
import { useField } from "react-final-form"

interface RadioFieldTableProps<T> {
  name: string
  options: { id: number; label: string }[]
  extraData?: T[]
  extraColumns?: any[]
  value?: number | null // New prop for pre-selected value
  onChange?: (selectedId: number) => void // Callback for when a radio button is selected
}

const RadioFieldTable = <T,>({
  name,
  options,
  extraData = [],
  extraColumns = [],
  value, // Receive the pre-selected value
  onChange, // Receive the onChange callback
}: RadioFieldTableProps<T>) => {
  const {
    input: { value: selectedId, onChange: setSelectedId },
    meta,
  } = useField(name, { subscription: { value: true, touched: true, error: true } })

  // Ensure the selected ID is initialized with the provided value
  React.useEffect(() => {
    if (value && value !== selectedId) {
      setSelectedId(value)
    }
  }, [value, selectedId, setSelectedId])

  const handleSelection = useCallback(
    (id) => {
      setSelectedId(id)
      if (onChange) {
        onChange(id) // Trigger the parent callback when a selection is made
      }
    },
    [setSelectedId, onChange]
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
      <Table columns={columns} data={data} addPagination={true} />
      {meta.touched && meta.error && (
        <div role="alert" style={{ color: "red" }}>
          {meta.error}
        </div>
      )}
    </>
  )
}

export default RadioFieldTable
