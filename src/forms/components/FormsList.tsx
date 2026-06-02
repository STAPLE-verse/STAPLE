import { useMemo } from "react"
import Table from "src/core/components/Table"
import { getFormsColumns } from "src/forms/tables/columns/FormsColumns"
import { processForms } from "../tables/processing/processForms"
import { FormWithFormVersion } from "../queries/getForms"
import { ColumnFiltersState, PaginationState, OnChangeFn } from "@tanstack/react-table"

type FormsListProps = {
  forms: FormWithFormVersion[]
  manualPagination?: boolean
  paginationState?: PaginationState
  onPaginationChange?: OnChangeFn<PaginationState>
  pageCount?: number
  pageSizeOptions?: number[]
  onGlobalFilterChange?: (filter: string) => void
  onFolderFilterChange?: (folderId: number | null | "all") => void
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void
  onFormsUpdated?: () => Promise<void> | void
}

export const FormsList = ({
  forms,
  manualPagination = false,
  paginationState,
  onPaginationChange,
  pageCount,
  pageSizeOptions,
  onGlobalFilterChange,
  onFolderFilterChange,
  onColumnFiltersChange,
  onFormsUpdated,
}: FormsListProps) => {
  const formsTableData = processForms(forms)
  const columns = useMemo(
    () => getFormsColumns(onFolderFilterChange, onFormsUpdated),
    [onFolderFilterChange, onFormsUpdated]
  )

  return (
    <main className="flex flex-col mx-auto w-full">
      <Table
        columns={columns}
        data={formsTableData}
        addPagination={true}
        manualPagination={manualPagination}
        paginationState={paginationState}
        onPaginationChange={onPaginationChange}
        pageCount={pageCount}
        pageSizeOptions={pageSizeOptions}
        onGlobalFilterChange={onGlobalFilterChange}
        onColumnFiltersChange={onColumnFiltersChange}
      />
    </main>
  )
}
