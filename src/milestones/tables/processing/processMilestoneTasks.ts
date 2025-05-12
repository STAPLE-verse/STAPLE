import { Status } from "db"

// Milestone task table
export type MilestoneTasksData = {
  name: string
  deadline: Date | null
  status: string
  view: {
    taskId: number
    projectId: number
  }
}

export function processMilestoneTasks(tasks): MilestoneTasksData[] {
  return tasks.map((task) => ({
    name: task.name,
    deadline: task.deadline,
    status: task.status === Status.COMPLETED ? "Completed" : "Not completed",
    view: {
      taskId: task.id,
      projectId: task.projectId,
    },
  }))
}
