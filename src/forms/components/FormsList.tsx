import Table from "src/core/components/Table"
import { FormWithFormVersion, formsTableColumns } from "src/forms/components/FormsTable"

type FormsListProps = {
  forms: FormWithFormVersion[]
  page: number
  goToPreviousPage: () => void
  goToNextPage: () => void
  hasMore: boolean
}

export const FormsList = ({
  forms,
  page,
  goToPreviousPage,
  goToNextPage,
  hasMore,
}: FormsListProps) => {
  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">All Forms</h1>
      <Table columns={formsTableColumns} data={forms} />
      <div className="join grid grid-cols-2 my-6">
        <button
          className="join-item btn btn-secondary"
          disabled={page === 0}
          onClick={goToPreviousPage}
        >
          Previous
        </button>
        <button className="join-item btn btn-secondary" disabled={!hasMore} onClick={goToNextPage}>
          Next
        </button>
      </div>
    </main>
  )
}
