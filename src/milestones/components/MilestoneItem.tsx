import { Routes } from "@blitzjs/next"
import { Task, Milestone } from "@prisma/client"
import Link from "next/link"
import { useState } from "react"
import UpdateTasks from "./UpdateTasks"
import DateFormat from "src/core/components/DateFormat"

interface MilestoneItemProps {
  key: number | string
  milestone: Milestone
  projectId: number
  tasks: Task[]
  onTasksUpdated: () => void
}

const MilestoneItem: React.FC<MilestoneItemProps> = ({
  milestone,
  projectId,
  tasks,
  onTasksUpdated,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  // Filter tasks to get only the tasks for the current milestone
  const milestoneTasks = tasks.filter((task) => task.milestoneId === milestone.id)

  return (
    <div className="collapse collapse-arrow bg-base-300 mb-2" key={milestone.id}>
      {/* Don't change this one it's not a check box */}
      <input type="checkbox" />
      {/* Milestone name */}
      <div className="collapse-title text-xl font-medium">{milestone.name}</div>
      <div className="collapse-content">
        {/* Milestone description */}
        <p className="mb-2">{milestone.description}</p>
        {/* Milestone last update */}
        <p className="italic mb-2">
          Last update: <DateFormat date={milestone.updatedAt}></DateFormat>
        </p>

        {/* Tasks in the milestone */}
        <div className="divider font-medium">Tasks</div>
        <div className="flex flex-row overflow-x-auto space-x-4 pb-6">
          {milestoneTasks && milestoneTasks.length > 0 ? (
            milestoneTasks.map((task) => (
              <div key={task.id} className="card bg-base-100 text-base-content flex-shrink-0 w-1/4">
                <div className="card-body">
                  {/* Task name */}
                  <div className="card-title text-base-content justify-center">{task.name}</div>
                  {task.description && <div>{task.description.substring(0, 50)}</div>}
                  {task.deadline ? (
                    <p className="italic mb-2">
                      Deadline: <DateFormat date={task.deadline}></DateFormat>
                    </p>
                  ) : (
                    <p className="italic mb-2">No deadline</p>
                  )}
                </div>
                {/* TODO: Possibly add more information for the tasks */}
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
          <UpdateTasks
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
