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
    <main className="flex flex-col mx-auto w-full">
      <Table columns={FormsColumns} data={formsTableData} addPagination={true} />
    </main>
  )
}
