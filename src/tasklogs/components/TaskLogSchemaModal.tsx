import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import getProjectMember from "src/projectmembers/queries/getProjectMember"
import { CompletedAs } from "db"
import CompleteSchema from "./CompleteSchema"
import { useTaskContext } from "src/tasks/components/TaskContext"

export const AssignmentSchemaModal = ({ assignment }) => {
  const currentUser = useCurrentUser()
  const projectId = useParam("projectId", "number")
  const [currentProjectMember] = useQuery(getProjectMember, {
    where: { projectId: projectId, userId: currentUser!.id },
  })
  const { task } = useTaskContext()

  return (
    <>
      <CompleteSchema
        currentAssignment={assignment}
        completedBy={currentProjectMember.id}
        completedAs={assignment.teamId ? CompletedAs.TEAM : CompletedAs.INDIVIDUAL}
        schema={task.formVersion?.schema}
        ui={task.formVersion?.uiSchema}
      />
    </>
  )
}
