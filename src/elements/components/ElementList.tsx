import { useParam } from "@blitzjs/next"
import { useRouter } from "next/router"
import { usePaginatedQuery, useQuery } from "@blitzjs/rpc"
import getElements from "../queries/getElements"
import ElementItem from "./ElementItem"
import getTasks from "src/tasks/queries/getTasks"
import PaginationControls from "src/core/components/PaginationControls"

interface ElementsListProps {
  searchTerm: string
}

const ITEMS_PER_PAGE = 7

export const ElementsList: React.FC<ElementsListProps> = ({ searchTerm }) => {
  // Setup
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const projectId = useParam("projectId", "number")

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
      <PaginationControls page={page} hasMore={hasMore} />
    </div>
  )
}
