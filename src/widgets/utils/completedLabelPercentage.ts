import { Task } from "@prisma/client"

export const completedLabelPercentage = (tasks: Task[]): number => {
  if (tasks.length === 0) {
    return 0
  }

  const completedLabels = tasks.filter((task) => {
    const l = task.hasOwnProperty("labels") ? task["labels"].length : 0
    return l > 0
  })

  return completedLabels.length / tasks.length
}
