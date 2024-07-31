import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import getContributor from "src/contributors/queries/getContributor"
import { CompletedAs } from "db"
import CompleteSchema from "./CompleteSchema"
import { useTaskContext } from "src/tasks/components/TaskContext"

export const AssignmentSchemaModal = ({ assignment }) => {
  const currentUser = useCurrentUser()
  const projectId = useParam("projectId", "number")
  const [currentContributor] = useQuery(getContributor, {
    where: { projectId: projectId, userId: currentUser!.id },
  })
  const { task } = useTaskContext()

  return (
    <>
      <CompleteSchema
        currentAssignment={assignment}
        completedBy={currentContributor.id}
        completedAs={assignment.teamId ? CompletedAs.TEAM : CompletedAs.INDIVIDUAL}
        schema={task.schema}
        ui={task.ui}
      />
    </>
  )
}
