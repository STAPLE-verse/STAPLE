import { Status } from "db"

// Project task table
export type ProjectTasksData = {
  name: string
  description: string
  deadline: Date | null
  status: string
  view: {
    taskId: number
    projectId: number
  }
}

export function processProjectTasks(tasks): ProjectTasksData[] {
  return tasks.map((task) => ({
    name: task.name,
    description: task.description ? task.description.substring(0, 50) : "No Description",
    deadline: task.deadline,
    status: task.status === Status.COMPLETED ? "Completed" : "Not completed",
    view: {
      taskId: task.id,
      projectId: task.projectId,
    },
  }))
}
