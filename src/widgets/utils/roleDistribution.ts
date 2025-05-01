import { TaskWithRoles } from "src/core/types"

export const roleDistribution = (tasks: TaskWithRoles[]): Record<string, number> => {
  const roleCount: Record<string, number> = {}

  tasks.forEach((task) => {
    if (task.roles && task.roles.length > 0) {
      task.roles.forEach((role) => {
        const roleName = role.name // Access the name property of the role
        roleCount[roleName] = (roleCount[roleName] || 0) + 1
      })
    }
  })

  return roleCount
}
