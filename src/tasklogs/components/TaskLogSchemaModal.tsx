import { useParam } from "@blitzjs/next"
import { CompletedAs } from "db"
import CompleteSchema from "./CompleteSchema"
import { useTaskContext } from "src/tasks/components/TaskContext"
import { useCurrentProjectMember } from "src/projectmembers/hooks/useCurrentProjectMember"

export const TaskLogSchemaModal = ({ taskLog }) => {
  const projectId = useParam("projectId", "number")
  const { projectMember: currentProjectMember } = useCurrentProjectMember(projectId)

  const { task } = useTaskContext()

  return (
    <>
      <CompleteSchema
        taskLog={taskLog}
        completedById={currentProjectMember!.id}
        completedAs={taskLog.name ? CompletedAs.TEAM : CompletedAs.INDIVIDUAL}
        schema={task.formVersion?.schema}
        ui={task.formVersion?.uiSchema}
      />
    </>
  )
}
