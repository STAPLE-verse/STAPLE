import React, { useMemo, useState } from "react"
import { Gantt, Task as GanttTask, ViewMode } from "gantt-task-react"
import "gantt-task-react/dist/index.css"
import { useMutation, useQuery } from "@blitzjs/rpc"
import getMilestones from "../queries/getMilestones"
import { MilestoneWithTasks } from "src/core/types"
import MissingDatesModal from "./MissingDatesModal"
import { getMissingMilestoneAndTaskRows } from "../utils/ganttRowHelpers"
import { transformMilestonesToGanttTasks } from "../utils/transformMilestonesToGanttTasks"
import { useMemberPrivileges } from "src/projectprivileges/components/MemberPrivilegesContext"
// import getProject from "src/projects/queries/getProject"
import updateMilestoneDates from "../mutations/updateMilestoneDates"
import updateTaskDates from "src/tasks/mutations/updateTaskDates"
import toast from "react-hot-toast"
import { MemberPrivileges } from "db"

interface GanttChartProps {
  projectId: number
}

const GanttChart = ({ projectId }: GanttChartProps) => {
  const { privilege } = useMemberPrivileges()
  // const [project] = useQuery(getProject, {
  //   id: projectId,
  // })

  const [updateMilestoneDatesMutation] = useMutation(updateMilestoneDates)
  const [updateTaskDatesMutation] = useMutation(updateTaskDates)

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

  const onDateChange = async (task: GanttTask) => {
    if (privilege !== MemberPrivileges.PROJECT_MANAGER) {
      toast.error("You don't have permission to update dates.")
      return
    }

    // const minDate = new Date(project.createdAt)

    // if (task.start < minDate) {
    //   toast.error("Start date cannot be before the project start date.")
    //   return
    // }

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
      await refetch()
    } catch (error) {
      console.error("Failed to update task/milestone:", error)
      toast.error("Failed to update dates.")
    }
  }

  return (
    <>
      <div className="flex flex-col justify-end mb-4">
        <div className="gantt-wrapper">
          <Gantt
            tasks={ganttTasks}
            viewMode={ViewMode.Day}
            columnWidth={65}
            onDateChange={onDateChange}
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
