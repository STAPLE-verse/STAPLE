interface TableColumn {
  header: string
  accessorKey: string
  id: string
}

export function createDynamicTable(schema: any): TableColumn[] {
  const columns: TableColumn[] = []

  if (schema && schema.properties && typeof schema.properties === "object") {
    for (const [key, value] of Object.entries(schema.properties)) {
      if (typeof value === "object" && value !== null) {
        const columnObject: TableColumn = {
          header: (value as { title?: string }).title ?? key,
          accessorKey: key,
          id: key,
        }
        columns.push(columnObject)
      }
    }
  }

  return columns
}
