import React, { useEffect, useMemo, useState } from "react"
import { Gantt, Task as GanttTask, ViewMode } from "gantt-task-react"
import { useMutation } from "@blitzjs/rpc"
import { MilestoneWithTasks } from "src/core/types"
import MissingDatesModal from "./MissingDatesModal"
import { getMissingMilestoneAndTaskRows } from "../utils/ganttRowHelpers"
import { transformMilestonesToGanttTasks } from "../utils/transformMilestonesToGanttTasks"
import { useMemberPrivileges } from "src/projectprivileges/components/MemberPrivilegesContext"
import updateMilestoneDates from "../mutations/updateMilestoneDates"
import updateTaskDates from "src/tasks/mutations/updateTaskDates"
import toast from "react-hot-toast"
import { MemberPrivileges } from "db"

interface GanttChartProps {
  milestones: MilestoneWithTasks[]
  onDataChange: () => void
}

const GanttChart = ({ milestones, onDataChange }: GanttChartProps) => {
  const { privilege } = useMemberPrivileges()

  const [updateMilestoneDatesMutation] = useMutation(updateMilestoneDates)
  const [updateTaskDatesMutation] = useMutation(updateTaskDates)

  const [modalOpen, setModalOpen] = useState(false)

  // Filter out milestones and tasks with missing dates
  const missingRows = useMemo(() => getMissingMilestoneAndTaskRows(milestones), [milestones])

  const [tasks, setTasks] = useState<GanttTask[]>(() => transformMilestonesToGanttTasks(milestones))

  useEffect(() => {
    setTasks(transformMilestonesToGanttTasks(milestones))
  }, [milestones])

  const handleExpanderClick = (tsk: GanttTask) => {
    if (tsk.type !== "project") return
    setTasks((prev) =>
      prev.map((t) => (t.id === tsk.id ? { ...t, hideChildren: !t.hideChildren } : t))
    )
  }

  const handleDateChange = async (task: GanttTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, start: task.start, end: task.end } : t))
    )

    if (privilege !== MemberPrivileges.PROJECT_MANAGER) {
      toast.error("You don't have permission to update dates.")
      return
    }

    const rawId = task.id.replace(/^(task-|milestone-)/, "") // remove prefix
    const numericId = Number(rawId)

    if (isNaN(numericId)) {
      toast.error("Invalid task or milestone ID.")
      return
    }

    try {
      if (task.type === "project") {
        await updateMilestoneDatesMutation({
          id: numericId,
          startDate: task.start,
          endDate: task.end,
        })
      } else {
        await updateTaskDatesMutation({
          id: numericId,
          startDate: task.start,
          deadline: task.end,
        })
      }
      toast.success("Dates updated successfully.")
      await onDataChange()
    } catch (error) {
      console.error("Failed to update task/milestone:", error)
      toast.error("Failed to update dates.")
    }
  }

  return (
    <>
      <div className="flex flex-col justify-end mb-4">
        {tasks.length > 0 ? (
          // Render the chart when there’s data
          <div className="gantt-wrapper" style={{ position: "relative", overflow: "visible" }}>
            <Gantt
              tasks={tasks}
              viewMode={ViewMode.Day}
              onDateChange={handleDateChange}
              onProgressChange={() => {}}
              onExpanderClick={handleExpanderClick}
            />
          </div>
        ) : (
          // Otherwise show a simple placeholder
          <div className="flex items-center justify-center py-12 text-gray-600">
            No milestones or tasks with valid dates to display.
          </div>
        )}
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
          await onDataChange()
        }}
      />
    </>
  )
}

export default GanttChart
