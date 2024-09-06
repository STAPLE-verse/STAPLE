import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"
import { usePaginatedQuery, useQuery } from "@blitzjs/rpc"
import getElements from "../queries/getElements"
import ElementItem from "./ElementItem"
import getTasks from "src/tasks/queries/getTasks"

interface ElementsListProps {
  searchTerm: string
}

export const ElementsList: React.FC<ElementsListProps> = ({ searchTerm }) => {
  // Setup
  const router = useRouter()
  const ITEMS_PER_PAGE = 7
  const page = Number(router.query.page) || 0
  const projectId = useParam("projectId", "number")

  const goToPreviousPage = () => router.push({ query: { projectId: projectId, page: page - 1 } })
  const goToNextPage = () => router.push({ query: { projectId: projectId, page: page + 1 } })

  // Get elements data
  const [{ elements, hasMore }] = usePaginatedQuery(getElements, {
    where: {
      project: { id: projectId! },
      OR: [
        {
          name: {
            contains: `${searchTerm}`,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: `${searchTerm}`,
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  // Fetch all tasks for the project
  const [{ tasks }, { refetch }] = useQuery(getTasks, {
    where: { projectId: projectId! },
    orderBy: [
      {
        deadline: {
          sort: "asc",
          nulls: "last",
        },
      },
    ],
  })

  return (
    <div>
      {/* Element cards */}
      {elements.map((element) => (
        <ElementItem
          key={element.id}
          element={element}
          projectId={projectId!}
          tasks={tasks}
          onTasksUpdated={refetch}
        />
      ))}
      {/* Previous and next page btns */}
      <div className="join grid grid-cols-2 mt-4">
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
    </div>
  )
}
