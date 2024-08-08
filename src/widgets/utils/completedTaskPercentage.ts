import { Task } from "@prisma/client"

export const completedTaskPercentage = (tasks: Task[]): number => {
  if (tasks.length === 0) {
    return 0
  }

  const completedTaskCount = tasks.filter((task) => task.status === "COMPLETED").length
  return completedTaskCount / tasks.length
}
