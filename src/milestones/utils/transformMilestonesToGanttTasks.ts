import { Task as GanttTask } from "gantt-task-react"
import { MilestoneWithTasks } from "src/core/types"
import { calculateProgressFromAssignedMembers } from "src/tasklogs/utils/calculateProgressFromAssignedMembers"

export const transformMilestonesToGanttTasks = (milestones: MilestoneWithTasks[]): GanttTask[] => {
  const out: GanttTask[] = []

  for (const m of milestones) {
    // Only consider tasks that have a deadline
    const validTasks = m.task.filter((t) => t.deadline)

    // if no explicit endDate AND no valid tasks, skip this milestone entirely
    if (!m.endDate && validTasks.length === 0) {
      continue
    }

    // 1) Compute milestone start: either the stored startDate or createdAt
    const milestoneStart = m.startDate ? new Date(m.startDate) : new Date(m.createdAt)

    // 2) Compute milestone end:
    //   • If m.endDate exists, use it
    //   • Else if any validTasks exist, pick the latest deadline
    let milestoneEnd: Date
    if (m.endDate) {
      milestoneEnd = new Date(m.endDate)
    } else {
      const latestDeadline = validTasks
        .map((t) => new Date(t.deadline!).getTime())
        .reduce((a, b) => Math.max(a, b), 0)
      milestoneEnd = new Date(latestDeadline)
    }

    // 3) Compute milestone progress: percent of validTasks with status === "COMPLETED"
    const milestoneProgress =
      validTasks.length > 0
        ? Math.round(
            (validTasks.filter((t) => t.status === "COMPLETED").length / validTasks.length) * 100
          )
        : 0

    // 4) Emit the milestone bar
    out.push({
      id: `milestone-${m.id}`,
      name: m.name,
      start: milestoneStart,
      end: milestoneEnd,
      type: "project",
      progress: milestoneProgress,
      isDisabled: true,
      dependencies: [],
    })

    // 5) Emit each child task bar, only for tasks with a deadline
    for (const t of validTasks) {
      const { completed, all } = calculateProgressFromAssignedMembers(t.assignedMembers)
      const taskProgress = all > 0 ? Math.round((completed / all) * 100) : 0

      out.push({
        id: `task-${t.id}`,
        name: t.name,
        start: t.startDate ? new Date(t.startDate) : new Date(t.createdAt),
        end: new Date(t.deadline!),
        type: "task",
        progress: taskProgress,
        isDisabled: false,
        dependencies: [`milestone-${m.id}`],
      })
    }
  }

  return out
}
