import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import { useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import getProjectMember from "src/projectmembers/queries/getProjectMember"
import { CompletedAs } from "db"
import CompleteSchema from "./CompleteSchema"
import { useTaskContext } from "src/tasks/components/TaskContext"

export const TaskLogSchemaModal = ({ taskLog }) => {
  const projectId = useParam("projectId", "number")
  const currentUser = useCurrentUser()
  const [currentProjectMember] = useQuery(getProjectMember, {
    where: {
      projectId: projectId,
      users: {
        some: {
          id: currentUser!.id,
        },
      },
    },
  })

  const { task } = useTaskContext()

  return (
    <>
      <CompleteSchema
        taskLog={taskLog}
        completedById={currentProjectMember.id}
        completedAs={taskLog.name ? CompletedAs.TEAM : CompletedAs.INDIVIDUAL}
        schema={task.formVersion?.schema}
        ui={task.formVersion?.uiSchema}
      />
    </>
  )
}
