import { Task } from "@prisma/client"

export const completedFormPercentage = (tasks: Task[]): number => {
  if (tasks.length === 0) {
    return 0
  }

  const allFormAssignments = tasks.filter((task) => {
    return task.formVersionId !== null
  })

  if (allFormAssignments.length > 0) {
    const allForms = allFormAssignments.flatMap((assignment) => assignment["assignees"])

    const completedFormAssignments = allForms.filter(
      (assignment) => assignment.statusLogs[0].status === "COMPLETED"
    )

    return completedFormAssignments.length / allFormAssignments.length
  } else {
    return 0
  }
}
