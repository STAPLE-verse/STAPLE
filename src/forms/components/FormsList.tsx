import Table from "src/core/components/Table"
import { FormsColumns } from "src/forms/tables/columns/FormsColumns"
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
}

export const FormsList = ({
  forms,
  manualPagination = false,
  paginationState,
  onPaginationChange,
  pageCount,
  pageSizeOptions,
}: FormsListProps) => {
  const formsTableData = processForms(forms)

  return (
    <main className="flex flex-col mx-auto w-full">
      <Table
        columns={FormsColumns}
        data={formsTableData}
        addPagination={true}
        manualPagination={manualPagination}
        paginationState={paginationState}
        onPaginationChange={onPaginationChange}
        pageCount={pageCount}
        pageSizeOptions={pageSizeOptions}
      />
    </main>
  )
}
