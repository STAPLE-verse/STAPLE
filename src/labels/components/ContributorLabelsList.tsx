import { usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import getLabels from "../queries/getLabels"
import { LabelInformation, labelTableColumnsSimple } from "./LabelTable"
import Table from "src/core/components/Table"

export const ContributorLabelsList = ({ userId }) => {
  const ITEMS_PER_PAGE = 7

  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ labels, hasMore }, { refetch }] = usePaginatedQuery(getLabels, {
    where: { user: { id: userId } },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

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
      onChangeCallback: undefined,
      taxonomyList: [],
    }
    return t
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <main className="flex flex-col mt-2 mx-auto w-full max-w-7xl">
        {/* <h1 className="flex justify-center mb-2">All Contributors</h1> */}
        <Table columns={labelTableColumnsSimple} data={contributorLabelnformation} />
        <div className="join grid grid-cols-2 my-6">
          <button
            className="join-item btn btn-secondary"
            disabled={page === 0}
            onClick={goToPreviousPage}
          >
            Previous
          </button>
          <button
            className="join-item btn btn-secondary"
            disabled={!hasMore}
            onClick={goToNextPage}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  )
}
