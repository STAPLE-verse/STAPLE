import React from "react"
import { Column } from "@tanstack/react-table"

function Filter({ column }: { column: Column<any, unknown> }) {
  const { filterVariant } = column.columnDef.meta ?? {}
  const isHtml = column.columnDef.meta?.isHtml || false
  const selectOptions = column.columnDef.meta?.selectOptions as
    | { label: string; value: string }[]
    | undefined
  const columnFilterValue = column.getFilterValue()
  const facetedUniqueValues = column.getFacetedUniqueValues()

  const onChangeCallback = React.useMemo(() => {
    return (value) => column.setFilterValue(value)
  }, [column])

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

  const sharedInputStyles =
    "input w-36 text-primary input-primary input-bordered border-2 bg-base-300 rounded input-sm focus:outline-secondary focus:outline-offset-0 focus:outline-width-3"

  return filterVariant === "range" ? (
    <div>
      <div className="flex flex-col space-y-2">
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
          className={sharedInputStyles}
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
          className={sharedInputStyles}
        />
      </div>
      <div className="h-1" />
    </div>
  ) : filterVariant === "select" ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
      className={sharedInputStyles}
    >
      <option value="">All</option>
      {selectOptions
        ? selectOptions.map((option, index) => (
            <option value={option.value} key={getUniqueKey(option.value, index)}>
              {option.label}
            </option>
          ))
        : sortedUniqueValues.map((value, index) => (
            // dynamically generated select options from faceted values feature
            <option
              value={value}
              key={getUniqueKey(value, index)}
              dangerouslySetInnerHTML={isHtml ? { __html: value } : undefined}
            >
              {!isHtml ? value : undefined}
            </option>
          ))}
    </select>
  ) : filterVariant === "multiselect" ? (
    <div className="dropdown">
      <label tabIndex={0} className="btn btn-primary">
        Filter
      </label>
      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-300 rounded-box w-52">
        {sortedUniqueValues.map((value, index) => (
          <li key={getUniqueKey(value, index)}>
            <label className="cursor-pointer flex items-center space-x-2">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                value={value}
                checked={
                  Array.isArray(columnFilterValue) ? columnFilterValue.includes(value) : false
                }
                onChange={(e) => {
                  const checked = e.target.checked
                  let newFilterValue = Array.isArray(columnFilterValue)
                    ? [...columnFilterValue]
                    : []
                  if (checked) {
                    newFilterValue.push(value)
                  } else {
                    newFilterValue = newFilterValue.filter((v) => v !== value)
                  }
                  column.setFilterValue(newFilterValue.length > 0 ? newFilterValue : undefined)
                }}
              />
              <span dangerouslySetInnerHTML={isHtml ? { __html: value } : undefined}>
                {!isHtml ? value : undefined}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <>
      {/* Autocomplete suggestions from faceted values feature */}
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.map((value: any, index: number) => (
          <option value={value} key={getUniqueKey(value, index)} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={onChangeCallback}
        // placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        placeholder="Search..."
        className={sharedInputStyles}
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
