import { TaskWithFormVersion } from "src/forms/components/ProjectFormsList"

export type ProjectFormData = {
  taskName: string
  formName: string
  taskId: number
  projectId: number
}

export function processProjectForms(tasks: TaskWithFormVersion[]): ProjectFormData[] {
  return tasks.map((task) => {
    return {
      taskName: task.name,
      formName: task.formVersion ? task.formVersion.name : "Unknown",
      taskId: task.id,
      projectId: task.projectId,
    }
  })
}
