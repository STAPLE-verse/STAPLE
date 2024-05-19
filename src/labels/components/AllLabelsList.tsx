import router, { useRouter } from "next/router"
import { usePaginatedQuery } from "@blitzjs/rpc"
import Table from "src/core/components/Table"
import { LabelInformation, lableTableColumns } from "src/labels/components/LabelTable"

export const AllLabelsList = ({ hasMore, page, labels, onChange, taxonomyList }) => {
  const router = useRouter()

  const labelChanged = async () => {
    if (onChange != undefined) {
      onChange()
    }
  }

  const uniqueValues = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  // const taxonomyList = labels
  //   .map((label) => {
  //     const taxonomy = label.taxonomy || ""
  //     return taxonomy
  //   })
  //   .filter(uniqueValues)

  const contributorLabelnformation = labels.map((label) => {
    const name = label.name
    const desciprition = label.description || ""
    const taxonomy = label.taxonomy || ""

    let t: LabelInformation = {
      name: name,
      description: desciprition,
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
      <Table columns={lableTableColumns} data={contributorLabelnformation} />
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