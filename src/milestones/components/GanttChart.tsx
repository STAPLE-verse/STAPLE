import React, { useMemo, useState } from "react"
import { Gantt, ViewMode } from "gantt-task-react"
import "gantt-task-react/dist/index.css"
import { useQuery } from "@blitzjs/rpc"
import getMilestones from "../queries/getMilestones"
import { MilestoneWithTasks } from "src/core/types"
import MissingDatesModal from "./MissingDatesModal"
import { getMissingMilestoneAndTaskRows } from "../utils/ganttRowHelpers"
import { transformMilestonesToGanttTasks } from "../utils/transformMilestonesToGanttTasks"

interface GanttChartProps {
  projectId: number
}

const GanttChart = ({ projectId }: GanttChartProps) => {
  // Fetch milestones and tasks
  const [{ milestones: fetchedMilestones }, { refetch }] = useQuery(getMilestones, {
    where: { projectId },
    include: {
      task: {
        include: {
          assignedMembers: {
            include: {
              taskLogAssignedTo: {
                select: {
                  id: true,
                  status: true,
                  createdAt: true,
                  assignedToId: true,
                },
              },
              users: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { id: "asc" },
  })
  const milestones = fetchedMilestones as MilestoneWithTasks[]
  // Filter out milestones and tasks with missing dates
  const missingRows = useMemo(() => getMissingMilestoneAndTaskRows(milestones), [milestones])

  // Transform milestones and tasks to Gantt tasks
  const ganttTasks = useMemo(() => transformMilestonesToGanttTasks(milestones), [milestones])

  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col justify-end mb-4">
        <div className="gantt-wrapper">
          <Gantt
            tasks={ganttTasks}
            viewMode={ViewMode.Day}
            columnWidth={65}
            onDateChange={() => {
              /* optionally refetch() */
            }}
            onProgressChange={() => {}}
          />
        </div>
        <div className="mt-4">
          <button
            className="btn btn-primary"
            onClick={() => setModalOpen(true)}
            disabled={missingRows.length === 0}
          >
            Fill missing dates ({missingRows.length})
          </button>
        </div>
      </div>
      <MissingDatesModal
        rows={missingRows}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onDatesUpdated={async () => {
          setModalOpen(false)
          await refetch()
        }}
      />
    </>
  )
}

export default GanttChart
