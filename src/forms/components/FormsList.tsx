import Table from "src/core/components/Table"
import { FormWithFormVersion, formsTableColumns } from "src/forms/components/FormsTable"

type FormsListProps = {
  forms: FormWithFormVersion[]
  addPagination: Boolean
}

export const FormsList = ({ forms }: FormsListProps) => {
  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">All Forms</h1>
      <Table columns={formsTableColumns} data={forms} addPagination={true} />
    </main>
  )
}
