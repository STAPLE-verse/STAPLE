import { Task } from "@prisma/client"

export const completedRolePercentage = (tasks: Task[]): number => {
  if (tasks.length === 0) {
    return 0
  }

  const completedRoles = tasks.filter((task) => {
    const l = task.hasOwnProperty("roles") ? task["roles"].length : 0
    return l > 0
  })

  return completedRoles.length / tasks.length
}
