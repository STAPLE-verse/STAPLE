import { Task as GanttTask } from "gantt-task-react"
import { MilestoneWithTasks } from "src/core/types"
import { calculateProgressFromAssignedMembers } from "src/tasklogs/utils/calculateProgressFromAssignedMembers"

export const transformMilestonesToGanttTasks = (milestones: MilestoneWithTasks[]): GanttTask[] => {
  const out: GanttTask[] = []

  for (const m of milestones) {
    const validTasks = m.task.filter((t) => t.deadline)

    if (validTasks.length === 0) continue

    const milestoneStart = m.startDate ?? m.createdAt

    const milestoneEnd =
      m.endDate ??
      new Date(
        Math.max(
          ...validTasks
            .map((t) => t.deadline)
            .filter(Boolean)
            .map((d) => new Date(d!).getTime())
        )
      )

    const completedTasksCount = validTasks.filter((t) => t.status === "COMPLETED").length
    const milestoneProgress = Math.round((completedTasksCount / validTasks.length) * 100)

    out.push({
      id: `milestone-${m.id}`,
      name: m.name,
      start: new Date(milestoneStart),
      end: milestoneEnd,
      type: "project",
      progress: milestoneProgress,
      isDisabled: true,
      dependencies: [],
    })

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
        dependencies: [m.id.toString()],
      })
    }
  }

  return out
}
