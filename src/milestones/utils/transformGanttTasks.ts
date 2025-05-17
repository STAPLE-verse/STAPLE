import { Task as GanttTask } from "gantt-task-react"
import { MilestoneWithTasks } from "src/core/types"

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

    out.push({
      id: `milestone-${m.id}`,
      name: m.name,
      start: new Date(milestoneStart),
      end: milestoneEnd,
      type: "project",
      progress: 0,
      isDisabled: true,
      dependencies: [],
    })

    for (const t of validTasks) {
      out.push({
        id: `task-${t.id}`,
        name: t.name,
        start: t.startDate ? new Date(t.startDate) : new Date(t.createdAt),
        end: new Date(t.deadline!),
        type: "task",
        progress: 0,
        isDisabled: false,
        dependencies: [m.id.toString()],
      })
    }
  }

  return out
}
