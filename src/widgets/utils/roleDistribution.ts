import { TaskWithRoles } from "src/core/types"

export const roleDistribution = (
  tasks: TaskWithRoles[]
): { title: string; value: number; color: string }[] => {
  if (tasks.length === 0) {
    return [] // Return an empty array if there are no tasks
  }

  const roleCount: Record<string, number> = {}

  tasks.forEach((task) => {
    if (task.roles && task.roles.length > 0) {
      task.roles.forEach((role) => {
        const roleName = role.name
        roleCount[roleName] = (roleCount[roleName] || 0) + 1
      })
    }
  })

  // Convert roleCount object to an array of { title, value, color } for use in the pie chart
  return Object.entries(roleCount).map(([role, count]) => ({
    title: role,
    value: count,
    color: generateRandomColor(), // Generate random color for each role
  }))
}

// Function to generate a random color for each slice
const generateRandomColor = () => {
  const letters = "0123456789ABCDEF"
  let color = "#"
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}
