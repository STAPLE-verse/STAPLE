import { usePaginatedQuery } from "@blitzjs/rpc"
import Table from "src/core/components/Table"
import { useRouter } from "next/router"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import getForms from "src/forms/queries/getForms"
import { formsTableColumns } from "src/forms/components/FormsTable"

const ITEMS_PER_PAGE = 10

export const FormsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const currentUser = useCurrentUser()

  const [{ forms, hasMore }] = usePaginatedQuery(getForms, {
    where: {
      user: { id: currentUser?.id },
    },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

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
