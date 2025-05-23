import { useRouter } from "next/router"
import MilestoneItem from "./MilestoneItem"
import PaginationControls from "src/core/components/PaginationControls"
import { MilestoneWithTasks } from "src/core/types"
import { Task } from "db"

interface MilestonesListProps {
  searchTerm: string
  milestones: MilestoneWithTasks[]
  refetch: () => void
  projectId: number
  tasks: Task[]
}

export const MilestoneList: React.FC<MilestonesListProps> = ({
  searchTerm,
  milestones,
  refetch,
  projectId,
  tasks,
}) => {
  // Setup
  const router = useRouter()
  const pageSize = 5
  const page = Number(router.query.page) || 0

  // Filter milestones based on search term
  const filtered = milestones.filter((m) =>
    [m.name, m.description].some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Paginate milestones
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize)

  return (
    <div>
      {/* Milestones cards */}
      {paginated.map((milestone) => (
        <MilestoneItem
          key={milestone.id}
          milestone={milestone}
          projectId={projectId!}
          onTasksUpdated={refetch}
          tasks={tasks}
        />
      ))}
      {/* Previous and next page btns */}
      <PaginationControls page={page} hasMore={filtered.length > (page + 1) * pageSize} />
    </div>
  )
}
