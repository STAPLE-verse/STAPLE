import { createDynamicTable } from "src/core/utils/createDynamicTable"

export const metadataTable = (schema) => {
  const nonDynamicColumns = [
    {
      header: "Completed By",
      accessorKey: "completedBy",
      id: "completedBy",
    },
    {
      header: "Changed At",
      accessorKey: "createdAt",
      id: "createdAt",
    },
  ]

  const dynamicColumns = createDynamicTable(schema)

  return [...nonDynamicColumns, ...dynamicColumns]
}
