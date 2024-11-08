import Table from "src/core/components/Table"
import { FormsColumns } from "src/forms/tables/columns/FormsColumns"
import { processForms } from "../tables/processing/processForms"
import { FormWithFormVersion } from "../queries/getForms"

type FormsListProps = {
  forms: FormWithFormVersion[]
  addPagination: Boolean
}

export const FormsList = ({ forms }: FormsListProps) => {
  const formsTableData = processForms(forms)

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      <h1 className="flex justify-center mb-2 text-3xl">All Forms</h1>
      <Table columns={FormsColumns} data={formsTableData} addPagination={true} />
    </main>
  )
}
