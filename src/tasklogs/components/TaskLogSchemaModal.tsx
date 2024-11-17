import { useParam } from "@blitzjs/next"
import { CompletedAs } from "db"
import CompleteSchema from "./CompleteSchema"
import { useTaskContext } from "src/tasks/components/TaskContext"
import { useCurrentContributor } from "src/contributors/hooks/useCurrentContributor"

export const TaskLogSchemaModal = ({ taskLog }) => {
  const projectId = useParam("projectId", "number")
  const { projectMember: currentProjectMember } = useCurrentContributor(projectId)

  const { task } = useTaskContext()

  return (
    <CompleteSchema
      taskLog={taskLog}
      completedById={currentProjectMember!.id}
      completedAs={taskLog.name ? CompletedAs.TEAM : CompletedAs.INDIVIDUAL}
      schema={task.formVersion?.schema}
      ui={task.formVersion?.uiSchema}
    />
  )
}
