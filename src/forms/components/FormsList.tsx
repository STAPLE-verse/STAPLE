import { useMemo } from "react"
import Table from "src/core/components/Table"
import { getFormsColumns } from "src/forms/tables/columns/FormsColumns"
import { processForms } from "../tables/processing/processForms"
import { FormWithFormVersion } from "../queries/getForms"
import { PaginationState, OnChangeFn } from "@tanstack/react-table"

type FormsListProps = {
  forms: FormWithFormVersion[]
  manualPagination?: boolean
  paginationState?: PaginationState
  onPaginationChange?: OnChangeFn<PaginationState>
  pageCount?: number
  pageSizeOptions?: number[]
  onGlobalFilterChange?: (filter: string) => void
  onFolderFilterChange?: (folderId: number | null | "all") => void
  onTagFilterChange?: (tag: string) => void
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
  onTagFilterChange,
}: FormsListProps) => {
  const formsTableData = processForms(forms)
  const columns = useMemo(
    () => getFormsColumns(onFolderFilterChange, onTagFilterChange),
    [onFolderFilterChange, onTagFilterChange]
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
      />
    </main>
  )
}
