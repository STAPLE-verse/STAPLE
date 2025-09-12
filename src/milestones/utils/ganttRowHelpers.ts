import { MilestoneWithTasks } from "src/core/types"
import { Task } from "@prisma/client"
import { GanttRow } from "../components/MissingDatesModal"

// Whether a milestone is missing required dates
const isMilestoneMissingDates = (m: MilestoneWithTasks): boolean =>
  m.task.length === 0 && !m.endDate

// Whether a task is missing its deadline
const isTaskMissingDates = (t: Task): boolean => !t.deadline

// Convert milestone to editable row
const transformMilestoneToRow = (m: MilestoneWithTasks): GanttRow => ({
  id: m.id,
  type: "milestone",
  name: m.name,
  startDate: m.startDate ? m.startDate.toISOString().slice(0, 10) : "",
  endDate: m.endDate ? m.endDate.toISOString().slice(0, 10) : "",
})

// Convert task to editable row
const transformTaskToRow = (t: Task, milestoneName: string): GanttRow => ({
  id: t.id,
  type: "task",
  name: t.name,
  startDate: t.startDate ? t.startDate.toISOString().slice(0, 10) : "",
  endDate: "",
})

// Main utility
export const getMissingMilestoneAndTaskRows = (milestones: MilestoneWithTasks[]): GanttRow[] => {
  const out: GanttRow[] = []

  for (const m of milestones) {
    if (isMilestoneMissingDates(m)) {
      out.push(transformMilestoneToRow(m))
    }

    for (const t of m.task) {
      if (isTaskMissingDates(t)) {
        out.push(transformTaskToRow(t, m.name))
      }
    }
  }

  return out
}
