import Table from "src/core/components/Table"
import { LabelInformation, labelTableColumns } from "src/labels/components/LabelTable"

export const AllLabelsList = ({ labels, onChange, taxonomyList }) => {
  const labelChanged = async () => {
    if (onChange != undefined) {
      onChange()
    }
  }

  const contributorLabelInformation = labels.map((label) => {
    const name = label.name
    const description = label.description || ""
    const taxonomy = label.taxonomy || ""

    let t: LabelInformation = {
      name: name,
      description: description,
      id: label.id,
      taxonomy: taxonomy,
      userId: label.userId,
      onChangeCallback: labelChanged,
      taxonomyList: taxonomyList,
    }
    return t
  })

  return (
    <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
      {/* <h1 className="flex justify-center mb-2">All Contributors</h1> */}
      <Table columns={labelTableColumns} data={contributorLabelInformation} addPagination={true} />
    </main>
  )
}
