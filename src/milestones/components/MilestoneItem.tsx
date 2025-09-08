import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"
import { MilestoneWithTasks } from "src/core/types"
import { Task } from "db"
import DateRange from "src/core/components/DateRange"

interface MilestoneItemProps {
  key: number | string
  milestone: MilestoneWithTasks
  projectId: number
  onTasksUpdated: () => void
  tasks: Task[]
}

const MilestoneItem: React.FC<MilestoneItemProps> = ({
  milestone,
  projectId,
  onTasksUpdated,
  tasks,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const milestoneTasks = tasks.filter((t) => t.milestoneId === milestone.id)

  return (
    <div className="collapse collapse-arrow bg-base-100 mb-2" key={milestone.id}>
      {/* Don't change this one it's not a check box */}
      <input type="checkbox" />
      {/* Milestone name */}
      <div className="collapse-title text-xl font-medium">{milestone.name}</div>
      <div className="collapse-content">
        {/* Milestone description */}
        <div className="mb-2 markdown-display">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
            {milestone.description || ""}
          </ReactMarkdown>
        </div>
        {/* Milestone date range */}
        <p className="italic mb-2">
          <DateRange
            start={milestone.startDate}
            end={milestone.endDate}
            emptyText="No date range set"
            className="italic"
          />
        </p>
        <div className="flex justify-end mt-4 gap-2">
          {/* Show milestone page */}
          <Link
            className="btn btn-primary"
            href={Routes.ShowMilestonePage({ projectId: projectId!, milestoneId: milestone.id })}
          >
            View Milestone
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MilestoneItem
