import { Column } from "@tanstack/react-table"

import React from "react"

function Filter({ column }: { column: Column<any, unknown> }) {
  const { filterVariant } = column.columnDef.meta ?? {}
  const columnFilterValue = column.getFilterValue()
  const facetedUniqueValues = column.getFacetedUniqueValues()

  const sortedUniqueValues = React.useMemo(
    () =>
      filterVariant === "range"
        ? []
        : Array.from(facetedUniqueValues.keys())
            .filter((value) => value !== null && value !== undefined)
            .sort()
            .slice(0, 5000),
    [facetedUniqueValues, filterVariant]
  )

  const getUniqueKey = (value: any, index: number) => `${value}-${index}`

  return filterVariant === "range" ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) => column.setFilterValue((old: [number, number]) => [value, old?.[1]])}
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0] !== undefined
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ""
          }`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) => column.setFilterValue((old: [number, number]) => [old?.[0], value])}
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1] ? `(${column.getFacetedMinMaxValues()?.[1]})` : ""
          }`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : filterVariant === "select" ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
    >
      <option value="">All</option>
      {sortedUniqueValues.map((value, index) => (
        //dynamically generated select options from faceted values feature
        <option value={value} key={getUniqueKey(value, index)}>
          {value}
        </option>
      ))}
    </select>
  ) : (
    <>
      {/* Autocomplete suggestions from faceted values feature */}
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="w-36 border shadow rounded"
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

export default Filter
