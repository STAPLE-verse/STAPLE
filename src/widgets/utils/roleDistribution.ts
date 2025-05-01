import { TaskWithRoles } from "src/core/types"

export const roleDistribution = (
  tasks: TaskWithRoles[]
): { label: string; value: number; color: string }[] => {
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
    label: role,
    value: count,
    color: generateOrderedColor(), // Generate color in fixed order for each role
  }))
}

// Mapping daisyUI color names to hex values based on light and dark themes
const daisyUIColorMap = {
  light: {
    primary: "#3b82f6", // Blue
    secondary: "#64748b", // Grey
    accent: "#f59e0b", // Yellow
    neutral: "#111827", // Dark grey
    "base-100": "#ffffff", // White
    "base-200": "#f1f5f9", // Light grey
    "base-300": "#e2e8f0", // Lighter grey
    info: "#0ea5e9", // Light blue
    success: "#22c55e", // Green
    warning: "#f59e0b", // Yellow
    error: "#ef4444", // Red
  },
  dark: {
    primary: "#1d4ed8", // Dark blue
    secondary: "#475569", // Dark grey
    accent: "#eab308", // Dark yellow
    neutral: "#f3f4f6", // Light grey
    "base-100": "#1f2937", // Dark background
    "base-200": "#2d3748", // Darker grey
    "base-300": "#4a5568", // Dark grey
    info: "#3b82f6", // Blue
    success: "#10b981", // Green
    warning: "#eab308", // Yellow
    error: "#ef4444", // Red
  },
}

// Determine the current theme based on the body class (this can also be done through a global state, if necessary)
const isDarkMode = typeof document !== "undefined" && document.body.classList.contains("dark")

// Define the fixed color sequence (using light or dark colors based on the theme)
const colorSequence = [
  "primary",
  "secondary",
  "accent",
  "neutral",
  "base-100",
  "base-200",
  "base-300",
  "info",
  "success",
  "warning",
  "error",
]

// Function to generate a color based on a fixed sequence, considering the current theme
let colorIndex = 0
const generateOrderedColor = (): string => {
  const colorName = colorSequence[colorIndex]
  colorIndex = (colorIndex + 1) % colorSequence.length // Cycle through the color sequence
  return daisyUIColorMap[isDarkMode ? "dark" : "light"][colorName!] || "#000000" // Use the appropriate color map based on theme
}
