import { Routes } from "@blitzjs/next"
import Link from "next/link"
import { useState } from "react"
import UpdateTasksMilestone from "./UpdateTasksMilestone"
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
        <p className="mb-2">{milestone.description}</p>
        {/* Milestone date range */}
        <p className="italic mb-2">
          <DateRange
            start={milestone.startDate}
            end={milestone.endDate}
            emptyText="No date range set"
            className="italic"
          />
        </p>
        {/* Tasks in the milestone */}
        <div className="divider font-medium">Tasks</div>
        <div className="flex flex-row overflow-x-auto space-x-4 pb-6">
          {milestoneTasks && milestoneTasks.length > 0 ? (
            milestoneTasks.map((task) => (
              <div key={task.id} className="card bg-base-300 text-base-content flex-shrink-0 w-1/4">
                <div className="card-body">
                  {/* Task name */}
                  <div className="card-title text-base-content justify-center">{task.name}</div>
                  {task.description && <div>{task.description.substring(0, 50)}</div>}
                  <p className="italic mb-2">
                    <DateRange
                      start={task.startDate}
                      end={task.deadline}
                      emptyText="No deadline set"
                      className="italic"
                    />
                  </p>
                </div>
                {/* Show task page */}
                <div className="card-actions justify-center mb-2">
                  <Link
                    className="btn btn-secondary"
                    href={Routes.ShowTaskPage({ projectId: projectId!, taskId: task.id })}
                  >
                    View
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>There are no tasks in the milestone.</p>
          )}
        </div>
        <div className="flex justify-end mt-4 gap-2">
          {/* Show milestone page */}
          <Link
            className="btn btn-primary"
            href={Routes.ShowMilestonePage({ projectId: projectId!, milestoneId: milestone.id })}
          >
            View Milestone
          </Link>
          {/* Update tasks in the milestone */}
          <button className="btn btn-secondary" onClick={openModal}>
            Update Tasks
          </button>
          <UpdateTasksMilestone
            milestoneId={milestone.id}
            open={isModalOpen}
            onClose={closeModal}
            onTasksUpdated={onTasksUpdated}
            tasks={tasks}
          />
        </div>
      </div>
    </div>
  )
}

export default MilestoneItem
