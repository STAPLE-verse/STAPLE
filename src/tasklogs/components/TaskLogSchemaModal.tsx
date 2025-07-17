import { useParam } from "@blitzjs/next"
import { CompletedAs } from "db"
import CompleteSchema from "./CompleteSchema"
import { useCurrentContributor } from "src/contributors/hooks/useCurrentContributor"
import { useTaskContext } from "src/tasks/components/TaskContext"

export const useSafeTaskContext = () => {
  try {
    return useTaskContext()
  } catch {
    return undefined
  }
}

export const TaskLogSchemaModal = ({
  taskLog,
  refetchTaskData,
}: {
  taskLog: any
  refetchTaskData?: () => Promise<void>
}) => {
  const projectId = useParam("projectId", "number")
  const { projectMember: currentProjectMember } = useCurrentContributor(projectId)

  const context = useSafeTaskContext()
  const task = taskLog.task ?? context?.task

  return (
    <CompleteSchema
      taskLog={taskLog}
      completedById={currentProjectMember!.id}
      completedAs={taskLog.assignedTo.name ? CompletedAs.TEAM : CompletedAs.INDIVIDUAL}
      schema={task.formVersion?.schema}
      ui={task.formVersion?.uiSchema}
      refetchTaskData={refetchTaskData}
    />
  )
}
