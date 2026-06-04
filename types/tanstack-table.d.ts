import "@tanstack/react-table"

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    filterVariant?: "text" | "range" | "select" | "multiselect"
    filterPlaceholder?: string
    isHtml?: boolean
    selectOptions?: { label: string; value: string }[]
  }
}
