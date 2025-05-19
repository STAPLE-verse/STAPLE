import { Routes } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import Table from "src/core/components/Table"
import getTasks from "src/tasks/queries/getTasks"
import { Milestone } from "@prisma/client"
import DateFormat from "src/core/components/DateFormat"
import { useState } from "react"
import UpdateTasks from "./UpdateTasksMilestone"
import { MilestoneTasksColumns } from "../tables/columns/MilestoneTasksColumns"
import { processMilestoneTasks } from "../tables/processing/processMilestoneTasks"
import TooltipWrapper from "src/core/components/TooltipWrapper"

interface MilestoneInformationProps {
  milestone: Milestone
  projectId: number | undefined
  onTasksUpdated: () => void
}

export const MilestoneInformation: React.FC<MilestoneInformationProps> = ({
  milestone,
  projectId,
  onTasksUpdated,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  // Get tasks
  const [{ tasks }, { refetch }] = useQuery(getTasks, {
    where: {
      project: { id: projectId! },
    },
    orderBy: { id: "asc" },
  })

  const milestoneTasks = tasks.filter((task) => task.milestoneId === milestone.id)

  const processedTasks = processMilestoneTasks(milestoneTasks)

  return (
    <div className="flex flex-row justify-center w-full">
      <div className="card bg-base-300 w-1/3 mr-2">
        <div className="card-body">
          {/* Milestone name */}
          <div className="card-title" data-tooltip-id="milestone-tool">
            {milestone.name}
          </div>
          <TooltipWrapper
            id="milestone-tool"
            content="Overall milestone information"
            className="z-[1099] ourtooltips"
          />
          {/* Milestone description */}
          {milestone.description}
          {/* Milestone last update */}
          <p className="italic">
            Last update: <DateFormat date={milestone.updatedAt}></DateFormat>
          </p>
          {/* Show update milestone page */}
          <div className="card-actions justify-end">
            <Link
              className="btn btn-primary"
              href={Routes.EditMilestonePage({ projectId: projectId!, milestoneId: milestone.id })}
            >
              Update Milestone
            </Link>

            <button className="btn btn-secondary" onClick={openModal}>
              Update Tasks
            </button>
            <UpdateTasks
              milestoneId={milestone.id}
              open={isModalOpen}
              onClose={closeModal}
              onTasksUpdated={refetch}
              tasks={tasks}
            />
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="card bg-base-300 w-2/3 h-auto">
        <div className="card-body">
          <div className="card-title" data-tooltip-id="tasks-tool">
            Tasks
          </div>
          <TooltipWrapper
            id="tasks-tool"
            content="Tasks assigned to this milestone"
            className="z-[1099] ourtooltips"
          />
          <div className="overflow-x-auto">
            <Table columns={MilestoneTasksColumns} data={processedTasks} addPagination={true} />
          </div>
        </div>
      </div>
    </div>
  )
}
