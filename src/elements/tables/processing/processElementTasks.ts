import { Status } from "db"

// Element task table
export type ElementTasksData = {
  name: string
  deadline: Date | null
  status: string
  view: {
    taskId: number
    projectId: number
  }
}

export function processElementTasks(tasks): ElementTasksData[] {
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
