import { Column, Table } from "@tanstack/react-table"

import React from "react"

function TextFilter({ column, table }: { column: Column<any, unknown>; table: Table<any> }) {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = React.useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column, firstValue]
    // [column.getFacetedUniqueValues()]
  )

  const onChangeCallback = React.useMemo(() => {
    return (value) => column.setFilterValue(value)
  }, [column])

  return (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.slice(0, 5000).map((value: any, index: number) => {
          return <option value={value} key={`${value}-${index}`} />
        })}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={onChangeCallback}
        //placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        placeholder={"Search"}
        className="input w-36 text-primary input-primary
          input-bordered border-2 bg-base-300 rounded input-sm
          focus:outline-secondary focus:outline-offset-0
          focus:outline-width-3"
        list={column.id + "list"}
      />
      <div className="h-1" />
    </>
  )
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce, onChange])

  return <input {...props} value={value} onChange={(e) => setValue(e.target.value)} />
}

export default TextFilter
